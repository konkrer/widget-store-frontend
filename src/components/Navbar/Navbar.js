import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NavDropdown, Navbar, Nav } from 'react-bootstrap';

// local imports
import { STORE_NAME } from '../../storeSetup';
import UserAuthElement from './UserAuthEl/UserAuthEl';
import NavbarCartElement from './NavbarCartEl/NavbarCartEl';
import { getPathRoot } from '../../utils/helpers';
import './Navbar.css';
import img from '../../assets/images/brandIcon.png';

/** Navbar wrapper allows navbar to be sticky. Provides background color. */
/* istanbul ignore next */
const NavbarWrapper = styled.div`
  background: linear-gradient(
    90deg,
    rgb(77 77 77 / 96%),
    rgb(122 2 2),
    rgb(77 77 77 / 96%)
  );
  position: ${p => (p.pathRoot === '/checkout' ? 'static' : 'sticky')};
  top: 0;
  z-index: 50;

  // landscape on phone no sticky navbar
  @media screen and (max-width: 991px) and (orientation: landscape) {
    position: static;
  }
`;

const NavbarOne = () => {
  const numCartItems = useSelector(state => state.cart.numCartItems) || null;
  const user = useSelector(state => state.user.token);
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  return (
    <NavbarWrapper pathRoot={pathRoot}>
      <Navbar expand="md" className="Navbar" variant="dark">
        <Navbar.Brand>
          <NavLink
            exact
            to="/shop"
            className="brand-style textShadowMedium navbar-brand rounded px-2"
          >
            <img
              src={img}
              height="30px"
              width="30px"
              alt="widget gyro"
              className="Navbar-brand-img"
            />{' '}
            {STORE_NAME}
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="pr-4">
          <Nav className="mr-auto" navbar>
            <Navbar.Text>
              <NavLink to="/new">New Products</NavLink>
            </Navbar.Text>
            <Navbar.Text>
              <NavLink to="/deals">Deals</NavLink>
            </Navbar.Text>
            <NavDropdown title="More">
              {user && (
                <>
                  <NavDropdown.Item as="button" className="px-0">
                    <NavLink
                      to="/user"
                      className="p-0 pl-4 d-inline-block w-100"
                    >
                      Account
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="button" className="px-0">
                    <NavLink
                      to="/orders"
                      className="p-0 pl-4 d-inline-block w-100"
                    >
                      Orders
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </>
              )}

              <NavDropdown.Item as="button" className="px-0">
                <NavLink to="/about" className="p-0 pl-4 d-inline-block w-100">
                  About
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item as="button" className="px-0">
                <NavLink
                  to="/contact"
                  className="p-0 pl-4 d-inline-block w-100"
                >
                  Contact
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item as="button" className="px-0">
                <NavLink to="/faq" className="p-0 pl-4 d-inline-block w-100">
                  FAQ
                </NavLink>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <UserAuthElement pathRoot={pathRoot} />
          <NavbarCartElement pathRoot={pathRoot} numCartItems={numCartItems} />
        </Navbar.Collapse>
      </Navbar>
    </NavbarWrapper>
  );
};

export default NavbarOne;
