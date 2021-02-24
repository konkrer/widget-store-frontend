import { useRef } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// local imports
import APIRequest from '../../hooks/apiHook';
import Navbar from '../../components/Navbar/Navbar';
import PanelClose from '../../components/common/PanelClose/PanelClose';
import OrderSuccessTable from './OrderSuccessTable/OrderSuccessTable';

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60vh;
`;

const OrderSuccess = () => {
  const { id } = useParams();
  const history = useHistory();
  const _token = useSelector(state => state.user.token);
  const params = useRef({ _token });
  let order;

  // get order details
  const { response } = APIRequest(`/orders/${id}`, 'get', null, params.current);

  if (response) order = response.order;

  return (
    <div className="OrderSuccess text-light">
      <Navbar />
      <motion.div
        initial={{ marginTop: '-100vh', opacity: 0 }}
        animate={{ marginTop: '0vh', opacity: 1 }}
        exit={{ marginTop: '100vh', opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container
          fluid="xl"
          className="dark-gradient-1 my-4 px-2 pt-0 py-5 rounded position-relative"
        >
          <PanelClose closeFunct={() => history.push('/shop')} />

          <FlexDiv>
            <h1 className="font-italic text-success">Order Success!</h1>
            <Col lg={6} className="py-0 mx-auto mt-3 mt-lg-5">
              <OrderSuccessTable order={order} id={id} />
              <h4 className="mt-5">
                Order conformation sent to{' '}
                <span className="font-italic text-info">
                  {response ? order.customer_info.email : 'email provided.'}
                </span>
              </h4>
              <Link to="/shop">
                <Button variant="primary mt-5">Continue Shopping</Button>
              </Link>
            </Col>
          </FlexDiv>
        </Container>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
