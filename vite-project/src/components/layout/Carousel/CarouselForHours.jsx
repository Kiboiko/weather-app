import { Carousel } from "antd";
import CardForHour from "../CardForHour";
export default function CarouselForHours({ weather }) {
  return (
    <div className="carousel-wrapper">
      <Carousel arrows infinite={false}>
        {weather.hourly.times.map((time, i) => (
          <div key={`hour-${i}-${time.getTime()}`}>
            <CardForHour
              time={time.getHours()}
              temp={weather.hourly.temps[i].toFixed(0)}
              rain={weather.hourly.rains[i]}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
