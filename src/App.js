import { useContext, useEffect } from "react";
import AppRouter from "./router/Router";
import { AppContext } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { IntlProvider } from "react-intl";
import messages_tr from "./locales/tr.json";
import messages_en from "./locales/en.json";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { getData } from "./helper/PostData";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const STORE_NAME = process.env.REACT_APP_STORE_NAME;

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Courier New", "Courier", "monospace"].join(","),
  },
  overrides: {
    MuiButton: {
      root: {
        fontWeight: 700,
      },
    },
  },
});

const messages = {
  tr: messages_tr,
  en: messages_en,
};

function App() {
  const { lang } = useContext(AppContext);

  const setDocumentTitle = () => {
    const userRole = localStorage.getItem("localRole");
    const stat =
      userRole === "admin" ||
      userRole === "shop_manager" ||
      userRole === "shop_packer"
        ? "pending"
        : "awaiting";
    getData(`${BASE_URL}etsy/summary_order/`).then((response) => {
      const obj = response?.data?.[0].find((item) => item.status === stat);
      const inProgessNumber = obj?.status_count || 0;
      const tabTitle = inProgessNumber + " | " + STORE_NAME;
      document.title = tabTitle;
    });
  };
  useEffect(() => {
    setDocumentTitle();
    const caller = setInterval(() => {
      setDocumentTitle();
    }, 300000);
    return () => {
      clearInterval(caller);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <IntlProvider messages={messages[lang]} locale={lang} defaultLocale="en">
        <AppRouter />
        <ToastContainer />
      </IntlProvider>
    </ThemeProvider>
  );
}

export default App;
