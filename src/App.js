import "./App.css";
import AppRouter from "./router/Router";
import { ContextProvider } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { IntlProvider } from "react-intl";
import messages_tr from "./locales/tr.json";
import messages_en from "./locales/en.json";

const messages = {
  tr: messages_tr,
  en: messages_en,
};
const language = navigator.language.split(/[-_]/)[0];

function App() {
  return (
    <div className="App">
      <IntlProvider
        messages={messages[language]}
        locale={language}
        defaultLocale="en"
      >
        <ContextProvider>
          <AppRouter />
          <ToastContainer />
        </ContextProvider>
      </IntlProvider>
    </div>
  );
}

export default App;
