import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import "./styles/global.scss";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#2D1B69",
        borderRadius: 12,
        fontFamily: "Inter, sans-serif",
      },
    }}
    locale={enUS}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ConfigProvider>,
);
