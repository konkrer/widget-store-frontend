import { useCallback } from 'react';
import { Tabs, Tab, Row, Col, Container, Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';

// local imports
import Login from './Login/Login';
import Signup from './Signup/Signup';

const LoginSignup = () => {
  const history = useHistory();
  // get signup search parameter from URL
  const search = useLocation().search;
  const signup = new URLSearchParams(search).get('signup');

  // close modal function
  const handleClose = useCallback(
    e => {
      return history.goBack();
    },
    [history]
  );

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} className="rounded">
          <div>
            <Modal show={true} onHide={handleClose}>
              <Modal.Body>
                <Tabs defaultActiveKey={signup || 'login'}>
                  <Tab eventKey="login" title="Login" className="p-5">
                    <Login handleClose={handleClose} />
                  </Tab>
                  <Tab eventKey="signup" title="Signup" className="p-5">
                    <Signup handleClose={handleClose} />
                  </Tab>
                </Tabs>
              </Modal.Body>
            </Modal>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignup;
