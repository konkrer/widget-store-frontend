/**
 * NavbarCartElement for Navbar.
 * Allow cart element to open side-cart on appropriate pages.
 *
 */

import { NavLink } from 'react-router-dom';
import { NavbarText } from 'reactstrap';

// local imports
import CartIconBadge from '../../common/CartIconBadge/CartIconBadge';

const NavbarCartElement = ({ pathRoot, numCartItems }) => {
  // allow side-cart on appropriate pages
  if (['/shop', '/deals', '/new'].includes(pathRoot)) {
    return (
      <NavLink to={`${pathRoot}/cart`}>
        <CartIconBadge numCartItems={numCartItems} />
      </NavLink>
    );
  }
  // otherwise show Icon
  return (
    <NavbarText className="navitem">
      <CartIconBadge numCartItems={numCartItems} />
    </NavbarText>
  );
};

export default NavbarCartElement;
