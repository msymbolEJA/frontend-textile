import "./App.css";
import AppRouter from "./router/Router";
import { ContextProvider } from "./context/Context";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <AppRouter />
      </ContextProvider>
    </div>
  );
}

export default App;
