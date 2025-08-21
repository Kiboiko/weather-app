import { Card, Space, Typography } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CurrentDayCards.css";
const gridStyle = {
  textAlign: "center",
  backgroundColor: "rgba(73, 80, 87, 0.95)",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  maxHeight: "25vh",
  padding: "0px",
  margin: "0px",
};

const cardHeadStyle = {
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  padding: "0 16px",
  color: "#fff",
  fontSize: "1.2rem",
  fontWeight: "bold",
};

export default function CurrentDay({ weather, city }) {
  return (
    <div>
      <div className="parentGrid">
        <Card
          style={{ ...gridStyle, gridArea: "c" }}
          headStyle={cardHeadStyle}
          title="Время суток"
          variant="borderless"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              padding: "10px 0",
            }}
          >
            {weather.current.is_day ? (
              <SunOutlined style={{ fontSize: "2rem", color: "white" }} />
            ) : (
              <MoonOutlined style={{ fontSize: "2rem", color: "white" }} />
            )}
            <Typography.Text
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginTop: "20px",
              }}
            >
              {weather.current.is_day ? "День" : "Ночь"}
            </Typography.Text>
          </div>
        </Card>

        <Card
          style={{ ...gridStyle, gridArea: "d" }}
          headStyle={cardHeadStyle}
          variant="borderless"
          title="Осадки"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              padding: "10px 0",
            }}
          >
            {weather.current.rain > 0 ? (
              <i
                className="bi bi-cloud-rain"
                style={{ fontSize: "2rem", color: "white" }}
              ></i>
            ) : (
              <i
                className="bi bi-cloud"
                style={{ fontSize: "2rem", color: "white" }}
              ></i>
            )}
            <Typography.Text
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginTop: "20px",
              }}
            >
              {weather.current.rain > 0
                ? `Дождь: ${weather.current.rain}mm`
                : "Без осадков"}
            </Typography.Text>
          </div>
        </Card>

        <Card
          style={{ ...gridStyle, gridArea: "e" }}
          headStyle={cardHeadStyle}
          variant="borderless"
          title="Влажность"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              padding: "10px 0",
            }}
          >
            <i
              className="bi bi-moisture"
              style={{ fontSize: "2rem", color: "white" }}
            ></i>
            <Typography.Text
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginTop: "20px",
              }}
            >
              {weather.current.relative_humidity + "%"}
            </Typography.Text>
          </div>
        </Card>

        <Card
          style={{ ...gridStyle, gridArea: "f" }}
          headStyle={cardHeadStyle}
          variant="borderless"
          title="Как ощущается"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              padding: "10px 0",
            }}
          >
            {weather.current.apparent_temperature < 0 ? (
              <i
                className="bi bi-thermometer-low"
                style={{ fontSize: "2rem", color: "white" }}
              ></i>
            ) : null}
            {weather.current.apparent_temperature > 0 &&
            weather.current.apparent_temperature < 24 ? (
              <i
                className="bi bi-thermometer-half"
                style={{ fontSize: "2rem", color: "white" }}
              ></i>
            ) : null}
            {weather.current.apparent_temperature > 24 ? (
              <i
                className="bi bi-thermometer-high"
                style={{ fontSize: "2rem", color: "white" }}
              ></i>
            ) : null}
            <Typography.Text
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginTop: "20px",
              }}
            >
              {weather.current.apparent_temperature + "°C"}
            </Typography.Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
