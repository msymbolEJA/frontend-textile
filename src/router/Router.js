import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// Pages
import Dashboard from "../components/dashboard/Dashboard";
import Account from "../components/account/Account";
import Login from "../components/login/Login";
import Navbar from "../components/navbar/Navbar";
import NewOrder from "../components/orders/new/NewOrder";
import Register from "../components/register/Register";
import DueDate from "../components/orders/duedate/DueDate"
import OrderPrep from "../components/orders/orderprep/OrderPrep"
import ForgetPassword from "../components/forgetpassword/ForgetPassword"
import ResetPassword from "../components/forgetpassword/ResetPassword"
import AllOrdersTable from '../components/orders/allorders/AllOrdersTable'
import Search from '../components/search/Search';
import ReadyOrders from '../components/orders/readyorders/ReadyOrders'
import OrderDetails from '../components/orders/readyorders/orderdetails/OrderDetails'
// Private Router
import PrivateRouter from './PrivateRouter';
import Approval from '../components/approval/Approval'

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/reset/:id" component={ResetPassword} />
        <Route path="/forgot" component={ForgetPassword} />
        <Route exact path="/" component={Login} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  );
};

const DefaultContainer = () => (
  <div>
    <Navbar />
    <PrivateRouter exact path="/dashboard" component={Dashboard} />
    <PrivateRouter exact path="/all-orders" component={AllOrdersTable} />
    <PrivateRouter exact path="/account" component={Account} />
    <PrivateRouter exact path="/new-order" component={NewOrder} />
    <PrivateRouter exact path="/due-date" component={DueDate} />
    <PrivateRouter exact path="/order-prep" component={OrderPrep} />
    <PrivateRouter exact path="/approval" component={Approval} />
    <PrivateRouter exact path="/search" component={Search} />
    <PrivateRouter exact path="/ready-orders" component={ReadyOrders} />
    <PrivateRouter exact path="/order-details" component={OrderDetails} />
  </div>
);

export default AppRouter;
