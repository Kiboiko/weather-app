import { Select, Spin, Alert, Empty } from "antd";
import { useState, useRef } from "react";
import { fetchCityCoordinates } from "./geocoding";
import { debounce } from "lodash";

const { Option } = Select;

export default function CitySelector({ onCitySelect }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef("");

  // Оптимизированный поиск с задержкой 500ms
  const debouncedSearch = debounce(async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cities = await fetchCityCoordinates(query);
      setOptions(cities);

      if (cities.length === 0 && query === searchRef.current) {
        setError("Ничего не найдено. Попробуйте другой запрос");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Ошибка при поиске. Проверьте соединение");
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = (query) => {
    searchRef.current = query;
    debouncedSearch(query);
  };

  const handleSelect = (value, option) => {
    onCitySelect({
      name: option.label.split(",")[0],
      lat: parseFloat(value.split(",")[0]),
      lon: parseFloat(value.split(",")[1]),
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Select
        showSearch
        placeholder="Начните вводить город"
        style={{ width: "100%", height: "4vh" }}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleSelect}
        notFoundContent={
          loading ? (
            <Spin size="small" />
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : (
            <Empty description="Введите название города" />
          )
        }
        options={options.map((city) => ({
          value: `${city.lat},${city.lon}`,
          label: `${city.name}${city.country ? `, ${city.country}` : ""}`,
        }))}
        suffixIcon={null}
        allowClear
      />
    </div>
  );
}
