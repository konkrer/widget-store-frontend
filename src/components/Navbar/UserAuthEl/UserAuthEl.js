/**
 * UserAuthElement for Navbar.
 * Allow link for users to log in or
 * button for users to logout.
 */
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

// local imports
import logout from '../../../redux/actions/user/logout';

const UserAuthElement = ({ pathRoot }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  // if user logged in show logout button
  if (user) {
    return (
      <Navbar.Brand>
        <button className="btn-noStyle navbtn" onClick={handleLogout}>
          Logout
        </button>
      </Navbar.Brand>
    );
  }
  // if not user logged in show login link
  return (
    <Navbar.Text>
      <NavLink to={`${pathRoot}/login`}>Login</NavLink>
    </Navbar.Text>
  );
};

export default UserAuthElement;
