export async function fetchCityCoordinates(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&accept-language=ru&limit=5`
    );

    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    const data = await response.json();

    return data
      .map((item) => ({
        name: item.display_name.split(",")[0],
        lat: item.lat,
        lon: item.lon,
        country: item.address?.country || item.address?.country_code || "",
      }))
      .filter((city) => city.name && city.lat && city.lon);
  } catch (error) {
    console.error("Ошибка поиска города:", error);
    return [];
  }
}
