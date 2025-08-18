import CitySelector from "../../../../CitySelector";
import { Card } from "antd";
import "./CurrentDayCards.css";
const gridStyle = {
  textAlign: "center",
  border: "1px solid grey",
};

export default function CurrentDay({ weather, city }) {
  return (
    <div>
      <div className="parentGrid">
        <Card style={{ ...gridStyle, gridArea: "c" }} variant="borderless">
          {weather.current.is_day ? "☀️ День" : "🌙 Ночь"}
        </Card>
        <Card style={{ ...gridStyle, gridArea: "d" }} variant="borderless">
          {weather.current.rain > 0
            ? `🌧️ Дождь: ${weather.current.rain}mm`
            : "☁️ Без осадков"}
        </Card>
        <Card style={{ ...gridStyle, gridArea: "e" }} variant="borderless">
          {"Относительная влажность: " +
            weather.current.relative_humidity +
            "%"}
        </Card>
        <Card style={{ ...gridStyle, gridArea: "f" }} variant="borderless">
          {"Как ощущается: " + weather.current.apparent_temperature + "°C"}
        </Card>
      </div>
    </div>
  );
}

{
  /* <div style={{ fontSize: "48px", marginRight: "20px" }}>
          {weather.current.temperature}°C
        </div>
        <div>
          <div style={{ fontSize: "18px" }}>
            {weather.current.is_day ? "☀️ День" : "🌙 Ночь"}
          </div>
          <div style={{ fontSize: "18px" }}>
            {weather.current.rain > 0
              ? `🌧️ Дождь: ${weather.current.rain}mm`
              : "☁️ Без осадков"}
          </div>
          <div style={{ fontSize: "18px" }}>
            {"Относительная влажность:" +
              weather.current.relative_humidity +
              "%"}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Обновлено: {weather.current.time.toLocaleTimeString()}
          </div>
        </div> */
}

{
  /* <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          background: weather.current.is_day ? "#f5f5f5" : "#333",
          color: weather.current.is_day ? "#333" : "#fff",
          borderRadius: "6px",
        }}
      ></div> */
}
