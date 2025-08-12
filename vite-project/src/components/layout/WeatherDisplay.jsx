import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import CardForHour from "./CardForHour";
import CarouselForHours from "./Carousel/CarouselForHours";
const WeatherSimple = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          latitude: 52.52,
          longitude: 13.41,
          hourly: ["temperature_2m", "rain"],
          current: ["temperature_2m", "is_day", "rain"],
        };

        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();

        const current = response.current();
        const hourly = response.hourly();

        // Получаем текущую дату
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Фильтруем часы только до конца текущих суток
        const hourlyTimes = [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval()
          ),
        ]
          .map(
            (_, i) =>
              new Date(
                (Number(hourly.time()) +
                  i * hourly.interval() +
                  utcOffsetSeconds) *
                  1000
              )
          )
          .filter((time) => time <= endOfDay);

        setWeather({
          current: {
            temp: current.variables(0).value().toFixed(0),
            isDay: current.variables(1).value(),
            rain: current.variables(2).value(),
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          },
          hourly: {
            times: hourlyTimes,
            temps: hourly
              .variables(0)
              .valuesArray()
              .slice(0, hourlyTimes.length),
            rains: hourly
              .variables(1)
              .valuesArray()
              .slice(0, hourlyTimes.length),
          },
        });
      } catch (error) {
        console.error("Ошибка при загрузке погоды:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка данных о погоде...</div>;
  if (!weather) return <div>Не удалось загрузить данные</div>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Погода сейчас</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          background: weather.current.isDay ? "#f5f5f5" : "#333",
          color: weather.current.isDay ? "#333" : "#fff",
          borderRadius: "6px",
        }}
      >
        <div style={{ fontSize: "48px", marginRight: "20px" }}>
          {weather.current.temp}°C
        </div>
        <div>
          <div style={{ fontSize: "18px" }}>
            {weather.current.isDay ? "☀️ День" : "🌙 Ночь"}
          </div>
          <div style={{ fontSize: "18px" }}>
            {weather.current.rain > 0
              ? `🌧️ Дождь: ${weather.current.rain}mm`
              : "☁️ Без осадков"}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Обновлено: {weather.current.time.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <h3>Прогноз по часам</h3>
      <CarouselForHours weather={weather} />
    </div>
  );
};

export default WeatherSimple;
