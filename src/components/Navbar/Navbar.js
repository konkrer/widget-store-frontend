import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavbarText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

// local imports
import { STORE_NAME } from '../../storeSetup';
import UserAuthElement from './UserAuthEl/UserAuthEl';
import NavbarCartElement from './NavbarCartEl/NavbarCartEl';
import { getPathRoot } from '../../utils/helpers';
import './Navbar.css';

/** Navbar wrapper allows navbar to be sticky. Provides background color. */
/* istanbul ignore next */
const NavbarWrapper = styled.div`
  background-color: rgb(47, 47, 47, 0.98);
  position: ${p => (p.pathRoot === '/checkout' ? 'static' : 'sticky')};
  top: 0;
  z-index: 50;

  // landscape on phone no sticky navbar
  @media screen and (max-width: 991px) and (orientation: landscape) {
    position: static;
  }
`;

const NavbarOne = () => {
  const [isOpen, setIsOpen] = useState(false);
  /* istanbul ignore next */
  const toggle = () => setIsOpen(!isOpen);
  const numCartItems = useSelector(state => state.cart.numCartItems) || null;
  const user = useSelector(state => state.user.token);
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  return (
    <NavbarWrapper pathRoot={pathRoot}>
      <Navbar dark expand="md" className="Navbar">
        <NavbarText>
          <NavLink exact to="/shop" className="navbar-brand brand-style">
            {STORE_NAME}
          </NavLink>
        </NavbarText>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className="pr-4">
          <Nav className="mr-auto" navbar>
            <NavbarText>
              <NavLink to="/new">New Products</NavLink>
            </NavbarText>
            <NavbarText>
              <NavLink to="/deals">Deals</NavLink>
            </NavbarText>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                More
              </DropdownToggle>
              <DropdownMenu>
                {user && (
                  <>
                    <DropdownItem>
                      <NavLink to="/user">Account</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink to="/orders">Orders</NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                  </>
                )}

                <DropdownItem>
                  <NavLink to="/about">About</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink to="/contact">Contact</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink to="/faq">FAQ</NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>

          <UserAuthElement pathRoot={pathRoot} />
          <NavbarCartElement pathRoot={pathRoot} numCartItems={numCartItems} />
        </Collapse>
      </Navbar>
    </NavbarWrapper>
  );
};

export default NavbarOne;
