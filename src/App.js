import { useContext } from "react";
import "./App.css";
import AppRouter from "./router/Router";
import { AppContext } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { IntlProvider } from "react-intl";
import messages_tr from "./locales/tr.json";
import messages_en from "./locales/en.json";

const messages = {
  tr: messages_tr,
  en: messages_en,
};

function App() {
  const { lang } = useContext(AppContext);

  return (
    <div className="App">
      <IntlProvider messages={messages[lang]} locale={lang} defaultLocale="en">
        <AppRouter />
        <ToastContainer />
      </IntlProvider>
    </div>
  );
}

export default App;
