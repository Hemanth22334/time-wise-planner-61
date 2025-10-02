import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskTitle } = await req.json();
    
    if (!taskTitle || typeof taskTitle !== 'string' || taskTitle.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Task title is required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a time estimation expert. Analyze the task description and provide a realistic time estimate in minutes.

Consider these factors:
- Task complexity and scope
- Typical time needed for similar tasks
- Include buffer time for unexpected issues
- Be realistic but not overly pessimistic

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{"minutes": <number>}

Examples:
- "Write a blog post" -> {"minutes": 90}
- "Reply to emails" -> {"minutes": 30}
- "Complete project proposal" -> {"minutes": 180}
- "Quick meeting" -> {"minutes": 15}
- "Learn React basics" -> {"minutes": 240}`;

    console.log("Analyzing task:", taskTitle);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Task: ${taskTitle}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze task" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", aiResponse);

    if (!aiResponse) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from AI
    let estimatedMinutes: number;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[^}]+\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      estimatedMinutes = parseInt(parsed.minutes);
      
      if (isNaN(estimatedMinutes) || estimatedMinutes <= 0) {
        throw new Error("Invalid minutes value");
      }
      
      // Cap at reasonable limits
      if (estimatedMinutes > 480) estimatedMinutes = 480; // Max 8 hours
      if (estimatedMinutes < 5) estimatedMinutes = 5; // Min 5 minutes
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: estimate based on task length
      const wordCount = taskTitle.trim().split(/\s+/).length;
      estimatedMinutes = Math.max(15, Math.min(60, wordCount * 10));
    }

    console.log("Estimated time:", estimatedMinutes, "minutes");

    return new Response(
      JSON.stringify({ minutes: estimatedMinutes }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in estimate-task-time function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
