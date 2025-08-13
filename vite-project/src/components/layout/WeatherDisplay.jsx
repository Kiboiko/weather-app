import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import CardForHour from "./Card/CardForHour";
import CarouselForHours from "./Carousel/CarouselForHours";
import CitySelector from "../../CitySelector";
import { fetchWeather } from "../../weather";

const WeatherSimple = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  // Загрузка погоды по координатам
  const loadWeatherData = async (lat, lon) => {
    setLoading(true);
    try {
      const params = {
        latitude: lat,
        longitude: lon,
        hourly: [
          "temperature_2m",
          "rain",
          "relative_humidity_2m",
          "wind_speed_10m",
          "visibility",
        ],
        current: ["temperature_2m", "relative_humidity_2m", "is_day", "rain"],
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
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
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

      // Получаем индексы для среза данных по отфильтрованному времени
      const hourlyDataLength = hourlyTimes.length;
      const totalHourlyPoints = hourly.variables(0).valuesArray().length;
      const startIndex = totalHourlyPoints - hourlyDataLength;

      setWeather({
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature: current.variables(0).value().toFixed(0),
          relative_humidity: current.variables(1).value(),
          is_day: current.variables(2).value(),
          rain: current.variables(3).value(),
        },
        hourly: {
          times: hourlyTimes,
          temperatures: hourly.variables(0).valuesArray().slice(startIndex),
          rains: hourly.variables(1).valuesArray().slice(startIndex),
          relative_humidities: hourly
            .variables(2)
            .valuesArray()
            .slice(startIndex),
          wind_speeds: hourly.variables(3).valuesArray().slice(startIndex),
          visibilities: hourly.variables(4).valuesArray().slice(startIndex),
        },
      });
    } catch (error) {
      console.error("Ошибка при загрузке погоды:", error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик выбора города
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    loadWeatherData(city.lat, city.lon);
  };

  // Загрузка данных по умолчанию (Берлин)
  useEffect(() => {
    if (!selectedCity) {
      loadWeatherData(52.52, 13.41); // Координаты Берлина по умолчанию
    }
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
      <div style={{ marginBottom: "20px" }}>
        <CitySelector onCitySelect={handleCitySelect} />
      </div>

      <h2 style={{ marginTop: 0 }}>
        {selectedCity ? `Погода в ${selectedCity.name}` : "Погода сейчас"}
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          background: weather.current.is_day ? "#f5f5f5" : "#333",
          color: weather.current.is_day ? "#333" : "#fff",
          borderRadius: "6px",
        }}
      >
        <div style={{ fontSize: "48px", marginRight: "20px" }}>
          {weather.current.temperature}°C
        </div>
        <div>
          <div style={{ fontSize: "18px" }}>
            {weather.current.is_day ? "☀️ День" : "🌙 Ночь"}
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
