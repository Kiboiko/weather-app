import { Carousel } from "antd";
import CardForHour from "../Card/CardForHour";
export default function CarouselForHours({ weather }) {
  return (
    <div className="carousel-wrapper">
      <Carousel
        arrows
        infinite={false}
        dots={true}
        style={{
          width: "38rem",
          textAlign: "center",
          height: "17.5vh",
          marginRight: "auto",
          marginLeft: "auto",
        }}
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
              weather_code={weather.hourly.weather_code[i]}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
