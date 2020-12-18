import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import Orders from "../components/orders/Orders";
import Login from "../components/login/Login";
import Navbar from "../components/navbar/Navbar";

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  );
};

const DefaultContainer = () => (
  <div>
    <Navbar />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/orders" component={Orders} />
  </div>
);

export default AppRouter;
