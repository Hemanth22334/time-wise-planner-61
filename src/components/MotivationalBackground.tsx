import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import flowPattern from "@/assets/flow-pattern.jpg";
import mountainBg from "@/assets/mountain-bg.jpg";

const backgrounds = [
  { id: 1, image: heroBg, name: "Workspace" },
  { id: 2, image: flowPattern, name: "Flow" },
  { id: 3, image: mountainBg, name: "Mountain" },
];

export const MotivationalBackground = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Background Images with Transitions */}
      {backgrounds.map((bg, index) => (
        <div
          key={bg.id}
          className="fixed inset-0 transition-opacity duration-2000 ease-in-out"
          style={{
            backgroundImage: `url(${bg.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: currentBg === index ? 1 : 0,
            zIndex: -2,
          }}
        />
      ))}

      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm" style={{ zIndex: -1 }} />

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Background Selector */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 bg-card/80 backdrop-blur-md p-2 rounded-full border border-border shadow-lg">
        {backgrounds.map((bg, index) => (
          <button
            key={bg.id}
            onClick={() => setCurrentBg(index)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              currentBg === index
                ? "border-primary scale-110 shadow-lg"
                : "border-border/50 opacity-60 hover:opacity-100"
            }`}
            style={{
              backgroundImage: `url(${bg.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title={bg.name}
          />
        ))}
      </div>
    </>
  );
};
