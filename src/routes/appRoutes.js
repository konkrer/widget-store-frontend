/** App routes for main app routing. */

import { Route, Switch } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// local imports
import Home from '../views/Home/Home';
import NewProducts from '../views/NewProducts/NewProducts';
import Deals from '../views/Deals/Deals';
import Checkout from '../views/Checkout/Checkout';
import OrderSuccess from '../views/OrderSuccess/OrderSuccess';
import Admin from '../views/Admin/Admin';
import NotFoundPage from '../views/NotFoundPage/NotFoundPage';
import { getPathRoot, FramerRedirect } from '../utils/helpers';

function Routes() {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter initial={true}>
      <Switch location={location} key={getPathRoot(location.pathname)}>
        <Route exact path="/">
          <FramerRedirect to="/shop" />
        </Route>

        <Route path="/shop">
          <Home />
        </Route>
        <Route path="/new">
          <NewProducts />
        </Route>
        <Route path="/deals">
          <Deals />
        </Route>

        <Route path="/checkout">
          <Checkout />
        </Route>

        <Route exact path="/order-success/:id">
          <OrderSuccess />
        </Route>

        <Route path="/admin">
          <Admin />
        </Route>

        <Route path="/user">
          <Home />
        </Route>
        <Route exact path="/about">
          <Home />
        </Route>
        <Route exact path="/contact">
          <Home />
        </Route>
        <Route exact path="/faq">
          <Home />
        </Route>
        <Route path="/">
          <NotFoundPage />
        </Route>
        <FramerRedirect to="/shop" />
      </Switch>
    </AnimatePresence>
  );
}

export default Routes;
