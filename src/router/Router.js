import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import Orders from "../components/orders/Orders";
import Account from "../components/account/Account";
import Login from "../components/login/Login";
import Navbar from "../components/navbar/Navbar";
import NewOrder from "../components/orders/new/NewOrder";
import Register from "../components/register/Register";
import DueDate from "../components/orders/duedate/DueDate"

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
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
    <Route path="/account" component={Account} />
    <Route path="/new-order" component={NewOrder} />
    <Route path="/due-date" component={DueDate} />
  </div>
);

export default AppRouter;
