// import { Card, Space, Typography, Divider, List, Col, Row } from "antd";
// import { fetchWeatherApi } from "openmeteo";

// const { Text, Title } = Typography;

// const params = {
//   latitude: 52.52,
//   longitude: 13.41,
//   hourly: ["temperature_2m", "rain"],
//   current: ["temperature_2m", "relative_humidity_2m", "is_day", "rain"],
// };
// const url = "https://api.open-meteo.com/v1/forecast";
// const responses = await fetchWeatherApi(url, params);
// const response = responses[0];

// // Получение данных о погоде
// const current = response.current();
// const hourly = response.hourly();
// const utcOffsetSeconds = response.utcOffsetSeconds();

// const weatherData = {
//   current: {
//     time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
//     temperature_2m: current.variables(0).value(),
//     relative_humidity_2m: current.variables(1).value(),
//     is_day: current.variables(2).value(),
//     rain: current.variables(3).value(),
//   },
//   hourly: {
//     time: Array.from({
//       length:
//         (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval(),
//     }).map(
//       (_, i) =>
//         new Date(
//           (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
//             1000
//         )
//     ),
//     temperature_2m: hourly.variables(0).valuesArray(),
//     rain: hourly.variables(1).valuesArray(),
//   },
// };

// export default function WeatherCards() {
//   return (
//     <div style={{ padding: "24px" }}>
//       <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
//         Погода в Берлине ({response.latitude()}°N, {response.longitude()}°E)
//       </Title>

//       <Row gutter={[16, 16]}>
//         {/* Карточка с текущей температурой */}
//         <Col span={8}>
//           <Card
//             title="Температура"
//             bordered={false}
//             headStyle={{ backgroundColor: "#f0f5ff", borderBottom: 0 }}
//           >
//             <Title level={1} style={{ textAlign: "center", margin: 0 }}>
//               {weatherData.current.temperature_2m}°C
//             </Title>
//             <Text
//               type="secondary"
//               style={{ display: "block", textAlign: "center" }}
//             >
//               {weatherData.current.is_day ? "День" : "Ночь"}
//             </Text>
//           </Card>
//         </Col>

//         {/* Карточка с влажностью */}
//         <Col span={8}>
//           <Card
//             title="Влажность"
//             bordered={false}
//             headStyle={{ backgroundColor: "#e6f7ff", borderBottom: 0 }}
//           >
//             <Title level={1} style={{ textAlign: "center", margin: 0 }}>
//               {weatherData.current.relative_humidity_2m}%
//             </Title>
//           </Card>
//         </Col>

//         {/* Карточка с осадками */}
//         <Col span={8}>
//           <Card
//             title="Осадки"
//             bordered={false}
//             headStyle={{ backgroundColor: "#fff2e8", borderBottom: 0 }}
//           >
//             <Title level={1} style={{ textAlign: "center", margin: 0 }}>
//               {weatherData.current.rain} mm
//             </Title>
//           </Card>
//         </Col>

//         {/* Карточка с почасовым прогнозом */}
//         <Col span={24}>
//           <Card
//             title="Почасовой прогноз на ближайшие 6 часов"
//             style={{ marginTop: "16px" }}
//           >
//             <List
//               grid={{ gutter: 16, column: 6 }}
//               dataSource={weatherData.hourly.time
//                 .slice(0, 6)
//                 .map((time, index) => ({
//                   time,
//                   temp: weatherData.hourly.temperature_2m[index].toFixed(1),
//                   rain: weatherData.hourly.rain[index],
//                 }))}
//               renderItem={(item) => (
//                 <List.Item>
//                   <Card size="small" title={`${item.time.getHours()}:00`}>
//                     <div style={{ textAlign: "center" }}>
//                       <Text strong>{item.temp}°C</Text>
//                       <Divider type="vertical" />
//                       <Text type="secondary">{item.rain} mm</Text>
//                     </div>
//                   </Card>
//                 </List.Item>
//               )}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Typography,
  Divider,
  List,
  Input,
  Button,
  message,
} from "antd";
import { fetchWeatherApi } from "openmeteo";

const { Title, Text } = Typography;
const { Search } = Input;

export default function WeatherDashboard() {
  const [city, setCity] = useState("Москва");
  const [coordinates, setCoordinates] = useState({ lat: 55.75, lon: 37.62 });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // Получаем координаты города
  const fetchCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cityName
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name.split(",")[0],
        };
      }
      return null;
    } catch (error) {
      console.error("Ошибка геокодинга:", error);
      return null;
    }
  };

  // Получаем погоду по координатам
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      const params = {
        latitude: lat,
        longitude: lon,
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
      message.error("Ошибка при получении погоды");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик поиска города
  const handleSearch = async () => {
    if (!citySearch.trim()) return;

    const coords = await fetchCoordinates(citySearch);
    if (coords) {
      setCity(coords.displayName);
      setCoordinates({ lat: coords.lat, lon: coords.lon });
      fetchWeather(coords.lat, coords.lon);
    } else {
      message.error("Город не найден");
    }
  };

  // Загружаем погоду при монтировании
  useEffect(() => {
    fetchWeather(coordinates.lat, coordinates.lon);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={2}>Прогноз погоды</Title>

          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <Search
              placeholder="Введите город"
              enterButton="Поиск"
              size="large"
              style={{ width: 400 }}
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </Col>
      </Row>

      {weatherData && (
        <>
          <Title level={3} style={{ textAlign: "center", margin: "16px 0" }}>
            {city} ({coordinates.lat.toFixed(2)}°N, {coordinates.lon.toFixed(2)}
            °E)
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card title="Температура" loading={loading}>
                <Title level={1} style={{ textAlign: "center", margin: 0 }}>
                  {weatherData.current.temperature}°C
                </Title>
                <Text
                  type="secondary"
                  style={{ display: "block", textAlign: "center" }}
                >
                  {weatherData.current.isDay ? "День" : "Ночь"}
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card title="Влажность" loading={loading}>
                <Title level={1} style={{ textAlign: "center", margin: 0 }}>
                  {weatherData.current.humidity}%
                </Title>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card title="Осадки" loading={loading}>
                <Title level={1} style={{ textAlign: "center", margin: 0 }}>
                  {weatherData.current.precipitation} mm
                </Title>
              </Card>
            </Col>

            <Col span={24}>
              <Card
                title={`Прогноз на 24 часа (обновлено: ${weatherData.current.time.toLocaleTimeString()})`}
              >
                <List
                  grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
                  dataSource={weatherData.hourly.time
                    .slice(0, 24)
                    .map((time, i) => ({
                      time,
                      temp: weatherData.hourly.temperature[i],
                      precipitation: weatherData.hourly.precipitation[i],
                    }))}
                  renderItem={(item) => (
                    <List.Item>
                      <Card size="small">
                        <Text strong>{item.time.getHours()}:00</Text>
                        <Divider style={{ margin: "8px 0" }} />
                        <div>Темп: {item.temp}°C</div>
                        <div>Осадки: {item.precipitation}mm</div>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
