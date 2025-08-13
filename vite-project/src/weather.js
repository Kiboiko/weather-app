import { fetchWeatherApi } from "openmeteo";

export async function fetchWeather(latitude, longitude, cityName = "") {
  const params = {
    latitude,
    longitude,
    hourly: ["temperature_2m", "rain"],
    current: ["temperature_2m", "relative_humidity_2m", "is_day", "rain"],
    timezone: "auto",
    forecast_days: 2, // Получаем данные на 2 дня
  };

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    // Получаем смещение часового пояса
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    const hourly = response.hourly();

    // Парсим текущую погоду
    const currentWeather = {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0).value(),
      humidity: current.variables(1).value(),
      isDay: current.variables(2).value(),
      rain: current.variables(3).value(),
    };

    // Парсим почасовой прогноз
    const hourlyForecast = {
      times: [...Array(24)].map((_, i) => {
        return new Date(
          (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
            1000
        );
      }),
      temperatures: hourly.variables(0).valuesArray().slice(0, 24),
      rains: hourly.variables(1).valuesArray().slice(0, 24),
    };

    return {
      cityName:
        cityName || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
      current: currentWeather,
      hourly: hourlyForecast,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Ошибка получения погоды:", error);
    throw new Error("Не удалось загрузить данные о погоде");
  }
}
