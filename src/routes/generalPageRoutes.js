/** Nested routes common to general website pages without product display.
 *
 * Routes included:
 *   "/cart"        ==> shopping cart route
 *   "/login"       ==> login/signup route
 */

import { Route } from 'react-router-dom';

// local imports
import LoginSignup from '../components/LoginSignup/LoginSignup';
import Cart from '../components/Cart/Cart';

/** GeneralPageRoutes()
 *
 * @param {string} props.pathRoot - what page user is on. e.g. "/shop"
 */

const GeneralPageRoutes = ({ pathRoot }) => {
  return (
    <>
      <Route exact path={`${pathRoot}/cart`}>
        <Cart />
      </Route>
      <Route exact path={`${pathRoot}/login`}>
        <LoginSignup />
      </Route>
    </>
  );
};

export default GeneralPageRoutes;
