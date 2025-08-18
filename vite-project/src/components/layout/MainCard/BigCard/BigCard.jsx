import { Card } from "antd";
import "./BigCard.css";
import { getcurrentTime, getCurrentDate } from "./currentTime";
import { useEffect, useState } from "react";
export default function BigCard({ weather, city }) {
  const [currentTime, setCurrentTime] = useState(getcurrentTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getcurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentDate(getCurrentDate());

    const dateInterval = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000);

    return () => clearInterval(dateInterval);
  }, []);

  return (
    <div className="bigCard">
      <p>{city}</p>
      <p>{weather.current.temperature}°C</p>
      <p>{currentDate}</p>
      <p>{currentTime}</p>
    </div>
  );
}
