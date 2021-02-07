import { useState } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Container,
  Modal,
  ModalBody,
} from 'reactstrap';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

// local imports
import Login from './Login/Login';
import Signup from './Signup/Signup';

const LoginSignup = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('1');

  // toggle tab
  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // close modal function
  const handleClose = e => {
    return history.goBack();
  };

  // modal variables
  const [modal] = useState(true);

  return (
    <Container>
      <Row className="">
        <Col sm="12" md={{ size: 6, offset: 3 }} className="rounded">
          <div>
            <Modal isOpen={modal} toggle={handleClose} className="">
              <ModalBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => {
                        toggleTab('1');
                      }}
                    >
                      Login
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => {
                        toggleTab('2');
                      }}
                    >
                      Signup
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="p-5">
                  <TabPane tabId="1">
                    <Login handleClose={handleClose} />
                  </TabPane>
                  <TabPane tabId="2">
                    <Signup handleClose={handleClose} />
                  </TabPane>
                </TabContent>{' '}
              </ModalBody>
            </Modal>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignup;
