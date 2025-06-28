import { useContext, useEffect, useState } from "react";
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
import api, { registerLoaderSetter } from "./helper/axios";

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
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(AppContext);

  useEffect(() => {
    // Loader'ı Axios'a bildir
    registerLoaderSetter(setLoading);

    const setDocumentTitle = () => {
      const userRole = localStorage.getItem("localRole");
      const stat =
        userRole === "admin" ||
        userRole === "shop_manager" ||
        userRole === "shop_packer"
          ? "pending"
          : "awaiting";

      const isBeyazit =
        (localStorage.getItem("localRole") === "workshop_manager" ||
          !localStorage.getItem("localRole") ||
          localStorage.getItem("localRole") === "null") &&
        !["asya", "umraniye"].includes(
          localStorage.getItem("workshop")?.toLowerCase()
        );

      if (isBeyazit) return;

      getData(`${BASE_URL}etsy/summary_order/`).then((response) => {
        const obj = response?.data?.[0].find((item) => item.status === stat);
        const inProgressNumber = obj?.status_count || 0;
        const tabTitle = inProgressNumber + " | " + STORE_NAME;
        document.title = tabTitle;
      });
    };

    setDocumentTitle();
    const caller = setInterval(() => {
      setDocumentTitle();
    }, 300000);
    return () => clearInterval(caller);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider
        messages={messages[lang]}
        locale={lang}
        defaultLocale="en"
      >
        <AppRouter />
        {loading && <div className="loader" />}
        <ToastContainer />
      </IntlProvider>
    </ThemeProvider>
  );
}

export default App;
