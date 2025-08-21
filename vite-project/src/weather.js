import { fetchWeatherApi } from "openmeteo";

export async function fetchWeather(latitude, longitude, cityName = "") {
  const params = {
    latitude,
    longitude,
    hourly: ["temperature_2m", "rain"],
    current: ["temperature_2m", "relative_humidity_2m", "is_day", "rain"],
    timezone: "auto",
    forecast_days: 1,
  };

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    const hourly = response.hourly();

    const currentWeather = {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0).value(),
      humidity: current.variables(1).value(),
      is_day: current.variables(2).value(),
      rain: current.variables(3).value(),
    };

    // Просто берем первые 24 элемента
    const hourlyForecast = {
      times: Array.from({ length: 24 }, (_, i) => {
        return new Date((Number(hourly.time(i)) + utcOffsetSeconds) * 1000);
      }),
      temperatures: Array.from({ length: 24 }, (_, i) =>
        hourly.variables(0).value(i)
      ),
      rains: Array.from({ length: 24 }, (_, i) => hourly.variables(1).value(i)),
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
