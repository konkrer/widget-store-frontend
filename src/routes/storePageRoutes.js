/** Nested routes common to store pages.
 *
 * Routes included:
 *   "/product/:id" ==> product detail route
 *   "/cart"        ==> shopping cart route
 *   "/login"       ==> login/signup route
 */

import { Route } from 'react-router-dom';

// local imports
import ProductDetail from '../components/ProductDetail/ProductDetail1/ProductDetail';
import ProductDetail2 from '../components/ProductDetail/ProductDetail2/ProductDetail2';
import LoginSignup from '../components/LoginSignup/LoginSignup';
import Cart from '../components/Cart/Cart';

/** StorePageRoutes()
 *
 * @param {string} props.pathRoot - what page user is on. e.g. "/shop"
 * @param {number} props.modalType - type of modal to display.
 *
 * modalType 1 = Bootstrap standard modal.
 * modalType 2 = custom modal. "Corner grow" modal.
 */
const StorePageRoutes = ({ pathRoot, modalType }) => {
  // set modal type
  let productDetailModal;
  switch (modalType) {
    case 1: {
      productDetailModal = <ProductDetail />;
      break;
    }
    case 2: {
      productDetailModal = <ProductDetail2 />;
      break;
    }
    /* istanbul ignore next */
    default:
      productDetailModal = <ProductDetail2 />;
  }

  return (
    <>
      <Route exact path={`${pathRoot}/product/:id`}>
        {productDetailModal}
      </Route>
      <Route exact path={`${pathRoot}/cart`}>
        <Cart />
      </Route>
      <Route exact path={`${pathRoot}/login`}>
        <LoginSignup />
      </Route>
    </>
  );
};

export default StorePageRoutes;
