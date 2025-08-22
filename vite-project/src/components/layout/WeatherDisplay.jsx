import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import CardForHour from "./Card/CardForHour";
import CarouselForHours from "./Carousel/CarouselForHours";
import CitySelector from "../../CitySelector";
import { fetchWeather } from "../../weather";
import MainCard from "./MainCard/MainCard";
import CurrentDay from "./MainCard/CurrentDayCards/CurrentDayCards";

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
          "weather_code",
        ],
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "is_day",
          "rain",
          "apparent_temperature",
          "weather_code",
        ],
        forecast_days: 1, // Добавляем параметр для получения только 1 дня
        timezone: "auto",
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const current = response.current();
      const hourly = response.hourly();

      // Получаем текущее время
      const now = new Date();
      const currentTime = now.getTime();

      // Создаем массив временных меток
      const hourlyTimes = [];
      const hourlyInterval = hourly.interval();
      const startTime = Number(hourly.time());

      // Генерируем временные метки для всех доступных часов
      for (let i = 0; i < hourly.variables(0).valuesArray().length; i++) {
        const timeMs =
          (startTime + i * hourlyInterval + utcOffsetSeconds) * 1000;
        hourlyTimes.push(new Date(timeMs));
      }

      // Фильтруем часы, которые еще не наступили (от текущего момента)
      const futureHourlyTimes = hourlyTimes.filter(
        (time) => time.getTime() >= currentTime
      );

      // Берем первые 24 часа будущего времени или все доступные, если меньше
      const hoursToShow = Math.min(24, futureHourlyTimes.length);
      const startIndex = hourlyTimes.length - futureHourlyTimes.length;

      setWeather({
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature: current.variables(0).value().toFixed(0),
          relative_humidity: current.variables(1).value(),
          is_day: current.variables(2).value(),
          rain: current.variables(3).value(),
          apparent_temperature: current.variables(4).value().toFixed(0),
          weather_code: current.variables(5).value(),
        },
        hourly: {
          times: futureHourlyTimes.slice(0, hoursToShow),
          temperatures: hourly
            .variables(0)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
          rains: hourly
            .variables(1)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
          relative_humidities: hourly
            .variables(2)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
          wind_speeds: hourly
            .variables(3)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
          visibilities: hourly
            .variables(4)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
          weather_code: hourly
            .variables(5)
            .valuesArray()
            .slice(startIndex, startIndex + hoursToShow),
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

  //Загрузка данных по умолчанию (Берлин)
  useEffect(() => {
    if (!selectedCity) {
      loadWeatherData(52.52, 13.41); // Координаты Берлина по умолчанию
    }
  }, []);

  if (loading) return <div>Загрузка данных о погоде...</div>;
  if (!weather) return <div>Не удалось загрузить данные</div>;

  const weatherDisplayStyle = {
    maxWidth: "80%",
    height: "93vh",
    minHeight: "520px",
    margin: "20px auto",
    padding: "20px",
    paddingBottom: "0px",
    marginBottom: "0px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(108, 117, 125, 0.8)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(9.1px)",
    WebkitBackdropFilter: "blur(9.1px)",
  };

  return (
    <div className="WeatherDisplay" style={weatherDisplayStyle}>
      <MainCard
        weather={weather}
        city={selectedCity ? selectedCity.name : "Берлин"}
        onCitySelect={handleCitySelect}
      />

      <h1
        style={{
          color: "white",
          paddingBottom: "0px",
          marginBottom: "0px",
          height: "auto",
        }}
      >
        Прогноз по часам
      </h1>
      <CarouselForHours weather={weather} />
    </div>
  );
};

export default WeatherSimple;
