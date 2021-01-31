import "./App.css";
import AppRouter from "./router/Router";
import { ContextProvider } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <AppRouter />
        <ToastContainer />
      </ContextProvider>
    </div>
  );
}

export default App;
