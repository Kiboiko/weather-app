import { Input, message } from "antd";
import { useWeather } from "../../context/WeatherContext";

const { Search } = Input;

const CitySearch = () => {
  const { setCity, setCoordinates, setLoading } = useWeather();
  const [searchValue, setSearchValue] = useState("");

  const fetchCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cityName
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name.split(",")[0],
        };
      }
      return null;
    } catch (error) {
      console.error("Ошибка геокодинга:", error);
      return null;
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) return;

    setLoading(true);
    const coords = await fetchCoordinates(value);
    setLoading(false);

    if (coords) {
      setCity(coords.displayName);
      setCoordinates({ lat: coords.lat, lon: coords.lon });
    } else {
      message.error("Город не найден");
    }
  };

  return (
    <Search
      placeholder="Введите город"
      enterButton="Поиск"
      size="large"
      style={{ width: 400 }}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onSearch={handleSearch}
    />
  );
};

export default CitySearch;
