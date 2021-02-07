import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// local imports
import APIRequest from '../../hooks/apiHook';
import Pricing1 from '../common/Pricing/Pricing1';
import CartIconBadge from '../common/CartIconBadge/CartIconBadge';
import addProduct from '../../redux/actions/cart/addProduct';
import { getPathRoot, animateVariant } from '../../helpers/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [animClass, setBtnAnimation] = useState('default');
  const numCartItems = useSelector(state => state.cart.numCartItems);
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  // add to cart form
  const INIT_FORM_STATE = { quantity: 1 };
  const [formData, setFormData] = useState(INIT_FORM_STATE);

  // close modal function
  const handleClose = e => {
    return history.push(pathRoot);
  };

  // modal variables
  const [modal] = useState(true);
  const closeBtn = (
    <button className="close" onClick={handleClose}>
      &times;
    </button>
  );

  // load product data
  const { loading, error, response } = APIRequest(`/products/${id}`, 'get');

  // if no product found go to path root i.e. /shop, /new, /deals
  if (error) {
    history.replace(pathRoot);
    return null;
  }
  if (loading) return null;

  const product = response.product;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: +value,
    }));
  };

  const handleAddToCart = e => {
    e.preventDefault();
    const copy = { ...product };
    delete copy.byline;
    delete copy.description;
    delete copy.date_added;
    delete copy.rating;
    dispatch(addProduct({ ...copy, quantity: formData.quantity }));
    animateVariant(setBtnAnimation, 1000);
  };

  return (
    <Modal
      isOpen={modal}
      toggle={handleClose}
      className="ProductDetail"
      size="xl"
      centered
    >
      <ModalHeader toggle={handleClose} close={closeBtn}>
        <div>{product.name}</div>
      </ModalHeader>
      <ModalBody className="p-0 row">
        <div className="col-12 col-lg-6">
          <img
            className={`ProductDetail-img img-fluid`}
            src={product.image_url}
            alt={product.name}
          />
        </div>

        <div className="col-12 col-lg-6">
          <div className="details p-2">
            <h5 className="mb-4 text-center pt-4">{product.byline}</h5>
            <p>{product.description}</p>
            <div className="text-right pb-3 pr-5 mr-5">
              <Pricing1 product={product} />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleAddToCart}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            placeholder="1"
            onChange={handleChange}
            value={formData.quantity}
          />
          <Button color="primary">Add To Cart</Button>
        </form>
        <Link to={`${pathRoot}/cart`}>
          <motion.div
            variants={{
              active: {
                scale: 1.6,
                rotateZ: 360,
                '--btnAnimColor': 'goldenrod',
                transition: 0.3,
              },
              default: {},
            }}
            animate={animClass}
            style={{ '--btnAnimColor': 'white' }}
          >
            <Button
              color="secondary"
              className={animClass}
              style={{ color: 'var(--btnAnimColor)' }}
              id="cart-button"
            >
              <CartIconBadge
                numCartItems={numCartItems}
                size="lg"
                className={`large`}
              />
            </Button>
            <UncontrolledTooltip placement="top" target="cart-button">
              Go To Shopping Cart
            </UncontrolledTooltip>
          </motion.div>
        </Link>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductDetail;
