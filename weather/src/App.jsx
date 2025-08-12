import { Layout } from "antd";
import { AppHeader } from "./components/Layout/AppHeader.jsx";
import CardApp from "./components/Layout/AppCard.jsx";
import { WeatherProvider } from "./context/WeatherContext.js";
import { WeatherPage } from "./pages/WeatherPage.jsx";
const contentStyle = {
  textAlign: "center",
  minHeight: "calc(100vh - 60px)",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#EFCBB3",
};

function App() {
  return (
    <WeatherProvider>
      <WeatherPage />
    </WeatherProvider>
  );
}

export default App;
