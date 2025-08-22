import { Card, Space } from "antd";
import "./CardForHour.css";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";
const miniStyle = {
  color: "white",
  padding: "10px",
};

function getSimpleWeatherEmoji(wmoCode) {
  if ([0, 1].includes(wmoCode)) return <i class="bi bi-sun"></i>; // Солнце
  if ([2, 3].includes(wmoCode)) return <i class="bi bi-cloudy"></i>; // Тучи
  if ([45, 48].includes(wmoCode)) return <i class="bi bi-cloud-fog"></i>; // Туман
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wmoCode))
    return <i class="bi bi-cloud-rain"></i>; // Дождь

  return "❓"; // Неизвестный код
}

export default function CardForHour({
  time,
  temp,
  rain,
  humidity,
  wind_speeds,
  visibilities,
  apparent_temperature,
  key,
  weather_code,
}) {
  return (
    <Space>
      <Card
        size="small"
        style={{
          width: "35rem",
          height: "14vh",
          textAlign: "center",
          backgroundColor: "rgba(73, 80, 87, 0.95)",
        }}
        bordered={false}
      >
        <div className="CardForOur">
          <div
            style={{
              ...miniStyle,
              gridArea: "a",
              fontWeight: "bolder",
              fontSize: "1.2rem",
            }}
          >
            <b>{time + ":00"}</b>
          </div>
          <div style={{ ...miniStyle, gridArea: "b" }}>
            {temp < 0 ? (
              <i
                className="bi bi-thermometer-low"
                style={{ color: "white" }}
              ></i>
            ) : null}
            {temp > 0 && temp < 24 ? (
              <i
                className="bi bi-thermometer-half"
                style={{ color: "white" }}
              ></i>
            ) : null}
            {temp > 24 ? (
              <i
                className="bi bi-thermometer-high"
                style={{ color: "white" }}
              ></i>
            ) : null}
            {temp + "°C"}
          </div>
          <div style={{ ...miniStyle, gridArea: "c", fontSize: "2rem" }}>
            {getSimpleWeatherEmoji(weather_code)}
          </div>
          <div style={{ ...miniStyle, gridArea: "d" }}>
            <i class="bi bi-droplet"></i>
            {" " + humidity + "%"}
          </div>
          <div style={{ ...miniStyle, gridArea: "e" }}>
            <i class="bi bi-wind"></i>
            {" " + wind_speeds + "km/h"}
          </div>
          <div
            style={{
              ...miniStyle,
              gridArea: "f",
            }}
          >
            <i class="bi bi-eye"></i>
            {" " + visibilities + "m"}
          </div>
        </div>
      </Card>
    </Space>
  );
}
