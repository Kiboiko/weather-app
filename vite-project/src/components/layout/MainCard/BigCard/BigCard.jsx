import { Card } from "antd";
import "./BigCard.css";
import { getcurrentTime, getCurrentDate } from "./currentTime";
import { useEffect, useState } from "react";

function getSimpleWeatherEmoji(wmoCode) {
  if ([0, 1].includes(wmoCode)) return <i class="bi bi-sun"></i>; // Солнце
  if ([2, 3].includes(wmoCode)) return <i class="bi bi-cloudy"></i>; // Тучи
  if ([45, 48].includes(wmoCode)) return <i class="bi bi-cloud-fog"></i>; // Туман
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wmoCode))
    return <i class="bi bi-cloud-rain"></i>; // Дождь

  return "❓"; // Неизвестный код
}

export default function BigCard({ weather, city }) {
  const [currentTime, setCurrentTime] = useState(getcurrentTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getcurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentDate(getCurrentDate());

    const dateInterval = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000);

    return () => clearInterval(dateInterval);
  }, []);
  return (
    <div className="bigCard">
      <p className="WeatherApp">
        <span className="Weather">Weather</span>
        <span className="App">App</span>
      </p>
      <div className="MainDisplay">
        <p className="cityName">{city}</p>
        <p className="currentDate">{currentDate}</p>
        <p className="currentTime">{currentTime}</p>
        <p className="weatherCurrentTemperature">
          {weather.current.temperature}°C
        </p>
        <p className="currentWeatherCode">
          {getSimpleWeatherEmoji(weather.current.weather_code)}
        </p>
      </div>
    </div>
  );
}
