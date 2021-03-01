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
import About from '../views/About/About';
import Admin from '../views/Admin/Admin';
import NotFoundPage from '../views/NotFoundPage/NotFoundPage';
import CommingSoon from '../views/CommingSoon/CommingSoon';
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
          <CommingSoon />
        </Route>
        <Route path="/orders">
          <CommingSoon />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/contact">
          <CommingSoon />
        </Route>
        <Route exact path="/faq">
          <CommingSoon />
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
