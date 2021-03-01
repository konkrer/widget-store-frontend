/**
 * NavbarCartElement for Navbar.
 * Allow cart element to open side-cart on appropriate pages.
 *
 */

import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

// local imports
import CartIconBadge from '../../common/CartIconBadge/CartIconBadge';

const NavbarCartElement = ({ pathRoot, numCartItems }) => {
  // allow side-cart on appropriate pages with NavLink
  if (!['/checkout'].includes(pathRoot)) {
    return (
      <NavLink to={`${pathRoot}/cart`} aria-label="cart">
        <CartIconBadge numCartItems={numCartItems} />
      </NavLink>
    );
  }
  // otherwise only show Icon
  return (
    <Navbar.Text className="navitem">
      <CartIconBadge numCartItems={numCartItems} />
    </Navbar.Text>
  );
};

export default NavbarCartElement;
