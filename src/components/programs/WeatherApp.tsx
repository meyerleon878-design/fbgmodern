import { useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

const cities = [
  { name: 'New York', temp: 22, condition: 'Partly Cloudy', icon: '⛅', humidity: 65, wind: 12, visibility: 10, high: 25, low: 18 },
  { name: 'London', temp: 14, condition: 'Rainy', icon: '🌧️', humidity: 82, wind: 18, visibility: 6, high: 16, low: 11 },
  { name: 'Tokyo', temp: 28, condition: 'Sunny', icon: '☀️', humidity: 55, wind: 8, visibility: 15, high: 31, low: 24 },
  { name: 'Berlin', temp: 10, condition: 'Cloudy', icon: '☁️', humidity: 70, wind: 15, visibility: 8, high: 13, low: 7 },
];

const forecast = [
  { day: 'Mon', icon: '☀️', high: 25, low: 18 },
  { day: 'Tue', icon: '⛅', high: 23, low: 17 },
  { day: 'Wed', icon: '🌧️', high: 20, low: 15 },
  { day: 'Thu', icon: '🌧️', high: 18, low: 13 },
  { day: 'Fri', icon: '⛅', high: 22, low: 16 },
  { day: 'Sat', icon: '☀️', high: 26, low: 19 },
  { day: 'Sun', icon: '☀️', high: 27, low: 20 },
];

const WeatherApp = () => {
  const [city, setCity] = useState(0);
  const c = cities[city];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-sky-500 to-blue-600 text-white overflow-auto">
      {/* City selector */}
      <div className="flex gap-2 p-3 overflow-x-auto">
        {cities.map((ct, i) => (
          <button key={i} onClick={() => setCity(i)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            city === i ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
          }`}>{ct.name}</button>
        ))}
      </div>

      {/* Current weather */}
      <div className="text-center py-6">
        <div className="text-6xl mb-2">{c.icon}</div>
        <div className="text-6xl font-light">{c.temp}°C</div>
        <div className="text-lg text-white/80">{c.condition}</div>
        <div className="text-sm text-white/60">H:{c.high}° L:{c.low}°</div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-4 gap-3 px-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Droplets className="w-5 h-5 mx-auto mb-1 text-white/70" />
          <div className="text-lg font-medium">{c.humidity}%</div>
          <div className="text-xs text-white/60">Humidity</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Wind className="w-5 h-5 mx-auto mb-1 text-white/70" />
          <div className="text-lg font-medium">{c.wind} km/h</div>
          <div className="text-xs text-white/60">Wind</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Eye className="w-5 h-5 mx-auto mb-1 text-white/70" />
          <div className="text-lg font-medium">{c.visibility} km</div>
          <div className="text-xs text-white/60">Visibility</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Thermometer className="w-5 h-5 mx-auto mb-1 text-white/70" />
          <div className="text-lg font-medium">{c.temp + 2}°</div>
          <div className="text-xs text-white/60">Feels like</div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="px-4 pb-4">
        <h3 className="text-sm text-white/60 mb-2">7-DAY FORECAST</h3>
        <div className="bg-white/10 rounded-lg divide-y divide-white/10">
          {forecast.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2">
              <span className="w-10 text-sm">{f.day}</span>
              <span className="text-lg">{f.icon}</span>
              <div className="flex gap-3 text-sm">
                <span>{f.high}°</span>
                <span className="text-white/50">{f.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
