import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// local imports
import CartItem from './CartItem/CartItem';
import incrementQuantity from '../../../redux/actions/cart/incrementQuantity';
import decrementQuantity from '../../../redux/actions/cart/decrementQuantity';
import removeProduct from '../../../redux/actions/cart/removeProduct';
import { animateVariant } from '../../../helpers/helpers';

const ItemsListDiv = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  min-height: ${p => (p.orderData ? '30vh' : '60vh')};
  max-height: 60vh;
  width: 95vw;
  margin-top: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${p => (p.numProducts === 1 ? 'white' : 'var(--light)')};
  box-sizing: content-box;

  @media screen and (min-width: 992px) {
    width: 480px;
    height: 60vh;
    max-height: 650px;
  }
`;

const ItemsListDivHeader = styled.div`
  @media screen and (min-width: 992px) {
    position: sticky;
    top: 0;
  }
`;

const TabulationDiv = styled.div`
  width: 95vw;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 10px;

  @media screen and (min-width: 992px) {
    width: 480px;
  }
`;

const TabulationTable = styled.table`
  border: none;
  font-weight: bold;
  font-size: 18px;

  @media screen and (min-width: 992px) {
    margin-top: 5px;
    margin-right: 15px;
    font-size: 21px;
  }
`;

const ItemsList = ({ disabled, orderData }) => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const itemsValues = Object.values(cart.items);

  // animation state
  const [animSubtotal, setAnimSubtotal] = useState(false);
  const [animTax, setAnimTax] = useState(false);
  const [animShipping, setAnimShipping] = useState(false);
  const [animTotal, setAnimTotal] = useState(false);

  // item functions
  const handleIncrement = id => {
    if (disabled) return;
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = id => {
    if (disabled) return;
    dispatch(decrementQuantity(id));
  };

  const handleRemove = id => {
    if (disabled) return;
    dispatch(removeProduct(id));
  };

  // animation effects
  useEffect(() => {
    animateVariant(setAnimSubtotal, 500);
  }, [cart.subtotal]);

  useEffect(() => {
    animateVariant(setAnimTax, 500);
  }, [orderData?.tax]);

  useEffect(() => {
    animateVariant(setAnimShipping, 500);
  }, [orderData?.shipping?.details?.cost]);

  useEffect(() => {
    animateVariant(setAnimTotal, 500);
  }, [orderData?.total]);

  return (
    <div>
      <ItemsListDiv
        orderData={!!orderData}
        className="ItemsListDiv mx-auto text-dark"
        numProducts={Object.keys(cart.items).length}
      >
        <ItemsListDivHeader className="border-bottom py-1 bg-secondary text-light">
          <div className="CartItem-name">Item</div>
          <div className="CartItem-price">Price</div>
          <div className="CartItem-quant-adj">Quantity</div>
          <div className="CartItem-total">Item Total</div>
        </ItemsListDivHeader>
        {itemsValues.map((item, idx) => (
          <CartItem
            item={item}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleRemove={handleRemove}
            key={item.product_id}
            disabled={disabled}
          />
        ))}
      </ItemsListDiv>
      <TabulationDiv>
        <TabulationTable className="TabulationTable ml-auto">
          <tbody>
            <tr>
              <td className="text-left">Subtotal</td>
              <td className="text-right">
                <motion.div
                  variants={{
                    active: {
                      scale: 1.3,
                    },
                    default: {},
                  }}
                  animate={animSubtotal}
                  transition={{ ease: 'easeInOut' }}
                >
                  ${cart.subtotal}
                </motion.div>
              </td>
            </tr>
            {orderData && (
              <tr>
                <td className="text-left">Tax</td>
                <td className="text-right">
                  <motion.div
                    variants={{
                      active: {
                        scale: 1.3,
                      },
                      default: {},
                    }}
                    animate={animTax}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.tax ? `$${orderData.tax}` : ''}
                  </motion.div>
                </td>
              </tr>
            )}
            {orderData && (
              <tr>
                <td className="text-left">Shipping</td>
                <td className="text-right">
                  <motion.div
                    variants={{
                      active: {
                        scale: 1.3,
                      },
                      default: {},
                    }}
                    animate={animShipping}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.shipping?.details?.cost
                      ? `$${orderData.shipping?.details?.cost}`
                      : ''}
                  </motion.div>
                </td>
              </tr>
            )}
            {orderData && (
              <tr className="border-top">
                <td className="text-left">Total</td>
                <td className="text-right">
                  <motion.div
                    variants={{
                      active: {
                        scale: 1.3,
                      },
                      default: {},
                    }}
                    animate={animTotal}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.total ? `$${orderData.total}` : ''}
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </TabulationTable>
      </TabulationDiv>
    </div>
  );
};

export default ItemsList;
