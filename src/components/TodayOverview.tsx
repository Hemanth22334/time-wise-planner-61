import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Clock } from "lucide-react";
import { format } from "date-fns";

export const TodayOverview = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Using Open-Meteo API (free, no API key required)
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            );
            const data = await response.json();
            setWeather(data);
            setLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoading(false);
          }
        );
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="h-8 w-8 text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="h-8 w-8 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-8 w-8 text-blue-200" />;
    return <Cloud className="h-8 w-8 text-gray-400" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code === 1) return "Mainly clear";
    if (code === 2) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    return "Cloudy";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-primary font-mono">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </div>
            <Badge variant="outline" className="text-sm">
              {format(currentTime, "zzz")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading weather...</div>
          ) : weather ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                {getWeatherIcon(weather.current.weather_code)}
                <div>
                  <div className="text-4xl font-bold">
                    {Math.round(weather.current.temperature_2m)}°C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getWeatherDescription(weather.current.weather_code)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                    <div className="font-semibold">{weather.current.relative_humidity_2m}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-muted-foreground">Wind</div>
                    <div className="font-semibold">{weather.current.wind_speed_10m} km/h</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Enable location access to see weather</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
