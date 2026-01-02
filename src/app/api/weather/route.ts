import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'London';
    
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url, {
      next: { revalidate: 600 }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        {
          weather: 'clear',
          temp: 22,
          description: 'Clear sky',
          icon: '01d',
          isDay: true,
          city: city,
          mock: true
        },
        { status: 200 }
      );
    }
    
    const data = await response.json();
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 20;
    
    return NextResponse.json({
      weather: data.weather[0].main.toLowerCase(),
      temp: Math.round(data.temperature),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      isDay,
      city: data.name,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      mock: false
    });
  } catch (error) {
    console.error('Weather API error:', error);
    
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 20;
    
    return NextResponse.json({
      weather: 'clear',
      temp: 22,
      description: 'Clear sky',
      icon: isDay ? '01d' : '01n',
      isDay,
      city: 'Demo City',
      mock: true
    });
  }
}
