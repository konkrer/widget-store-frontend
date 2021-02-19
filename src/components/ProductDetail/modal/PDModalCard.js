/** Product Detail Modal Card -> PDModalCard */
import { useState, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { motion } from 'framer-motion';

// fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

// local imports
import ModalCard from './ModalCard';
import Pricing1 from '../../common/Pricing/Pricing1';
import CartIconBadge from '../../common/CartIconBadge/CartIconBadge';
import addProduct from '../../../redux/actions/cart/addProduct';
import { getPathRoot, animateVariant } from '../../../utils/helpers';

/**
 * Product Detail Modal Card
 *
 * Returns 'card' with product info and add to cart functionality.
 *
 * If innerContentOnly is true returns inner content only - no card.
 * innerContentOnly is used inconjunction with bootstrap modals.
 */

const PDModalCard = ({ handleClose, product, innerContentOnly, disabled }) => {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const history = useHistory();
  const dispatch = useDispatch();

  // state
  const numCartItems = useSelector(state => state.cart.numCartItems);
  const [animClass, setBtnAnimation] = useState('default');
  const animationTimer = useRef(null);

  // add to cart form
  const INIT_FORM_STATE = { quantity: disabled ? product.quantity : 1 };
  const [formData, setFormData] = useState(INIT_FORM_STATE);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: +value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(addProduct({ ...product, quantity: formData.quantity }));
    animationTimer.current = animateVariant(setBtnAnimation, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(animationTimer.current);
    };
  }, []);

  const modalInner = (
    <>
      <Modal.Header>
        <h5>{product.name}</h5>

        <Button
          className="close-modal btn-noStyle text-dark"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faWindowClose} size={'lg'} />
        </Button>
      </Modal.Header>
      <Modal.Body className="p-0 row">
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
      </Modal.Body>
      <Modal.Footer>
        {/* Add to cart form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            placeholder="1"
            onChange={handleChange}
            value={formData.quantity}
            disabled={disabled}
          />
          <Button type="submit" variant="primary" disabled={disabled}>
            Add To Cart
          </Button>
        </form>
        {/* End add to cart form */}

        {/* Go to cart button w/ animation */}
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
          <OverlayTrigger
            placement={'top'}
            overlay={
              <Tooltip id="tooltip-carBtn">Go To Shopping Cart.</Tooltip>
            }
          >
            {({ ref, ...triggerHandler }) => (
              <Button
                {...triggerHandler}
                variant="secondary"
                ref={ref}
                className={animClass}
                style={{ color: 'var(--btnAnimColor)' }}
                id="cart-button"
                onClick={() => history.push(`${pathRoot}/cart`)}
                disabled={disabled || pathRoot === '/checkout'}
                aria-label={'go to cart'}
              >
                <CartIconBadge
                  numCartItems={numCartItems}
                  size="lg"
                  className={`large`}
                />
              </Button>
            )}
          </OverlayTrigger>
        </motion.div>
        {/* End go to cart button w/ animation */}

        <Button variant="secondary" className="close-modal">
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );

  // for placing content inside bootstrap modal
  if (innerContentOnly) return modalInner;

  return (
    <ModalCard
      className="ProductDetail"
      color="var(--dark)"
      data-testid="ModalCard"
    >
      {modalInner}
    </ModalCard>
  );
};

export default PDModalCard;
