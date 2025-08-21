import { Card, Space } from "antd";
import "./CardForHour.css";
export default function CardForHour({
  time,
  temp,
  rain,
  humidity,
  wind_speeds,
  visibilities,
  apparent_temperature,
  key,
}) {
  return (
    <Space>
      <Card
        size="small"
        style={{
          width: "30rem",
          height: "auto",
          textAlign: "center",
          backgroundColor: "grey",
        }}
      >
        <div>
          <span>
            <b>{time + ":00"}</b>
          </span>
          <span>{temp + "°C"}</span>
          <span>{rain > 0 ? "🌧️" : "☁️"}</span>
          <span>{humidity + "%"}</span>
          <span>{wind_speeds + "km/h"}</span>
          <span>{visibilities + "m"}</span>
        </div>
        <div></div>
      </Card>
    </Space>
  );
}
