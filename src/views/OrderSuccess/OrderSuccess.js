import { useRef } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Col, Button, Table } from 'reactstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// // get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

// local imports
import APIRequest from '../../hooks/apiHook';
import Navbar from '../../components/Navbar/Navbar';

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

  // get order details
  const { response } = APIRequest(`/orders/${id}`, 'get', null, params.current);

  if (response) var order = response.order;

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
          className="dark-gradient1 my-4 px-2 pt-0 py-5 rounded position-relative"
        >
          <div className="Panel-close">
            <button
              className="btn-noStyle"
              onClick={() => history.push('/shop')}
            >
              <FontAwesomeIcon icon={faWindowClose} size={'2x'} />
            </button>
          </div>
          <FlexDiv>
            <h1 className="font-italic text-success">Order Success!</h1>
            <Col lg={6} className="py-0 mx-auto mt-3 mt-lg-5">
              <Table dark>
                <tbody>
                  <tr>
                    <th scope="row">Order Id</th>
                    <td>{id}</td>
                  </tr>
                  {response && (
                    <>
                      <tr>
                        <th scope="row">Total</th>
                        <td>${order.total}</td>
                      </tr>
                      <tr>
                        <th scope="row">Order Date</th>
                        <td>
                          {order.order_date.match(/(\d{4}-\d{2}-\d{2})/)[1]}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Shipping</th>
                        <td>{order.shipping_method.details.name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Ordered By</th>
                        <td>{`${order.customer_info.first_name} ${order.customer_info.last_name}`}</td>
                      </tr>
                      {order.shipping_address && (
                        <tr>
                          <th scope="row">Shipped To</th>
                          <td>{`${order.shipping_address.first_name} ${order.shipping_address.last_name}`}</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </Table>
              <h4 className="mt-5">
                Order conformation sent to{' '}
                <span className="font-italic text-info">
                  {response ? order.customer_info.email : 'email provided.'}
                </span>
              </h4>
              <Link to="/shop">
                <Button color="primary mt-5">Continue Shopping</Button>
              </Link>
            </Col>
          </FlexDiv>
        </Container>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
