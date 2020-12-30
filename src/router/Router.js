import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import Orders from "../components/orders/Orders";
import Account from "../components/account/Account";
import Login from "../components/login/Login";
import Navbar from "../components/navbar/Navbar";
import NewOrder from "../components/orders/new/NewOrder";
import Register from "../components/register/Register";
import DueDate from "../components/orders/duedate/DueDate"
import OrderPrep from "../components/orders/orderprep/OrderPrep"
import PrivateRouter from './PrivateRouter';

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
    <PrivateRouter exact path="/dashboard" component={Dashboard} />
    <PrivateRouter exact path="/orders" component={Orders} />
    <PrivateRouter exact path="/account" component={Account} />
    <PrivateRouter exact path="/new-order" component={NewOrder} />
    <PrivateRouter exact path="/due-date" component={DueDate} />
    <PrivateRouter exact path="/order-prep" component={OrderPrep} />

  </div>
);

export default AppRouter;
