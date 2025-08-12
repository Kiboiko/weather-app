import { Layout } from "antd";

const headerStyle = {
  textAlign: "center",
  color: "#161616",
  height: 60,
  fontSize: "2rem",
  backgroundColor: "#EFCBB3",
  paddingInline: 10,
  borderBottom: "2px solid #161616",
};

export function AppHeader() {
  return <Layout.Header style={headerStyle}>Прогноз погоды</Layout.Header>;
}
