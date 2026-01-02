"use client";

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Moon } from 'lucide-react';
import { Card } from './ui/card';

interface WeatherData {
  weather: string;
  temp: number;
  description: string;
  isDay: boolean;
  city: string;
  humidity?: number;
  windSpeed?: number;
  mock?: boolean;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = localStorage.getItem('userCity') || 'London';
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (weatherType: string, isDay: boolean) => {
    const iconClass = "h-8 w-8";
    switch (weatherType.toLowerCase()) {
      case 'rain':
        return <CloudRain className={iconClass + " text-blue-400"} />;
      case 'drizzle':
        return <CloudDrizzle className={iconClass + " text-blue-300"} />;
      case 'snow':
        return <CloudSnow className={iconClass + " text-cyan-200"} />;
      case 'thunderstorm':
        return <CloudLightning className={iconClass + " text-yellow-400"} />;
      case 'clouds':
        return <Cloud className={iconClass + " text-gray-300"} />;
      case 'clear':
        return isDay ? 
          <Sun className={iconClass + " text-yellow-400"} /> : 
          <Moon className={iconClass + " text-purple-300"} />;
      default:
        return <Wind className={iconClass + " text-gray-400"} />;
    }
  };

  const getWeatherBoost = (weatherType: string) => {
    switch (weatherType.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return { stat: 'Focus', bonus: '+20%', color: 'text-blue-400' };
      case 'clear':
        return { stat: 'Fitness', bonus: '+15%', color: 'text-yellow-400' };
      case 'clouds':
        return { stat: 'Creativity', bonus: '+10%', color: 'text-purple-400' };
      default:
        return { stat: 'All Stats', bonus: '+5%', color: 'text-green-400' };
    }
  };

  if (loading) {
    return (
      <Card className="game-card p-4 animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </Card>
    );
  }

  if (!weather) return null;

  const boost = getWeatherBoost(weather.weather);

  return (
    <Card className="game-card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.weather, weather.isDay)}
          <div>
            <p className="text-2xl font-bold font-main">{weather.temp}°C</p>
            <p className="text-xs text-muted-foreground capitalize">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-primary">{weather.city}</p>
          <p className="text-xs text-muted-foreground">{weather.isDay ? '☀️ Day' : '🌙 Night'}</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-primary/20">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Weather Boost:</p>
          <p className={`text-sm font-bold ${boost.color}`}>
            {boost.stat} {boost.bonus}
          </p>
        </div>
      </div>
      
      {weather.mock && (
        <div className="absolute top-1 right-1">
          <span className="text-[8px] text-muted-foreground opacity-50">Demo</span>
        </div>
      )}
    </Card>
  );
}
