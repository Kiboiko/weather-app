import { useEffect } from "react";
import { Typography, Row, Col } from "antd";
import { useWeather } from "../context/WeatherContext";
import { fetchWeatherApi } from "openmeteo";
import CitySeacrh from "../components/Layout/CitySearch";
import CurrentWeather from "../components/Layout/WeatherCards/CurrentWeather";

const { Title } = Typography;

const WeatherPage = () => {
  const { city, coordinates, setWeatherData, setLoading } = useWeather();

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const params = {
          latitude: coordinates.lat,
          longitude: coordinates.lon,
          hourly: ["temperature_2m", "precipitation"],
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "is_day",
            "precipitation",
          ],
        };

        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const current = response.current();
        const hourly = response.hourly();
        const utcOffsetSeconds = response.utcOffsetSeconds();

        setWeatherData({
          current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0).value(),
            humidity: current.variables(1).value(),
            isDay: current.variables(2).value(),
            precipitation: current.variables(3).value(),
          },
          hourly: {
            time: Array.from({
              length:
                (Number(hourly.timeEnd()) - Number(hourly.time())) /
                hourly.interval(),
            }).map(
              (_, i) =>
                new Date(
                  (Number(hourly.time()) +
                    i * hourly.interval() +
                    utcOffsetSeconds) *
                    1000
                )
            ),
            temperature: hourly.variables(0).valuesArray(),
            precipitation: hourly.variables(1).valuesArray(),
          },
          location: {
            latitude: response.latitude(),
            longitude: response.longitude(),
            elevation: response.elevation(),
            timezoneOffset: utcOffsetSeconds,
          },
        });
      } catch (error) {
        console.error("Ошибка при получении погоды:", error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.lat && coordinates.lon) {
      fetchWeather();
    }
  }, [coordinates, setWeatherData, setLoading]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={2}>Прогноз погоды</Title>
          <CitySearch />
        </Col>
      </Row>

      <Title level={3} style={{ textAlign: "center", margin: "16px 0" }}>
        {city} ({coordinates.lat.toFixed(2)}°N, {coordinates.lon.toFixed(2)}°E)
      </Title>

      <CurrentWeather />
      <HourlyForecast />
    </div>
  );
};

export default WeatherPage;
