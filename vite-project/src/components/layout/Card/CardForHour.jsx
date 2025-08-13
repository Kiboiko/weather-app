import { Card, Space } from "antd";
import "./CardForHour.css";
export default function CardForHour({ time, temp, rain, key }) {
  return (
    <Space size={15}>
      <Card
        size="small"
        style={{
          width: "15rem",
          height: "3rem",
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
        </div>
        <div></div>
      </Card>
    </Space>
  );
}
