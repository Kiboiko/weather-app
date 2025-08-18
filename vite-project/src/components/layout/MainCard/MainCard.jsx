import BigCard from "./BigCard/BigCard.jsx";
import CurrentDay from "./CurrentDayCards/CurrentDayCards";
import "./MainCard.css";
import CitySelector from "../../../CitySelector.jsx";
export default function MainCard({ weather, city, onCitySelect }) {
  return (
    <div className="MainCard">
      <div style={{ gridArea: "a" }}>
        <BigCard weather={weather} city={city} />
      </div>

      <div style={{ gridArea: "b" }}>
        <CitySelector onCitySelect={onCitySelect} />
      </div>
      <div style={{ gridArea: "c" }}>
        <CurrentDay weather={weather} city={city} />
      </div>
    </div>
  );
}
