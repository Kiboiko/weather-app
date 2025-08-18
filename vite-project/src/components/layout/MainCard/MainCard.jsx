import BigCard from "./BigCard/BigCard.jsx";
import CurrentDay from "./CurrentDayCards/CurrentDayCards";
import "./MainCard.css";
export default function MainCard({ weather, city }) {
  return (
    <div className="MainCard">
      <BigCard weather={weather} city={city} />
      <CurrentDay weather={weather} city={city} />
    </div>
  );
}
