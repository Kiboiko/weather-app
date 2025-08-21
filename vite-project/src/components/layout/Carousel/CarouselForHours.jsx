import { Carousel } from "antd";
import CardForHour from "../Card/CardForHour";
export default function CarouselForHours({ weather }) {
  return (
    <div className="carousel-wrapper">
      <Carousel
        arrows
        infinite={false}
        dots={false}
        style={{ width: "30rem", textAlign: "center" }}
      >
        {weather.hourly.times.map((time, i) => (
          <div key={`hour-${i}-${time.getTime()}`}>
            <CardForHour
              time={time.getHours()}
              temp={weather.hourly.temperatures[i].toFixed(0)}
              rain={weather.hourly.rains[i]}
              humidity={weather.hourly.relative_humidities[i]}
              wind_speeds={weather.hourly.wind_speeds[i].toFixed(1)}
              visibilities={weather.hourly.visibilities[i]}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
