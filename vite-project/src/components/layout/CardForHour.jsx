import { Card, Space } from "antd";

export default function CardForHour({ time, temp, rain, key }) {
  return (
    <Space size={15}>
      <Card
        size="small"
        title={time + ":00"}
        style={{
          width: "15rem",
          height: "8rem",
          textAlign: "center",
          backgroundColor: "red",
        }}
      >
        <div>{temp + "°C"}</div>
        <div>{rain > 0 ? "🌧️" : "☁️"}</div>
      </Card>
    </Space>
  );
}
