/** Product Detail Modal Type 1
 *
 * Shows product details on a Bootstrap (reactstrap) modal.
 */

import { useParams, useHistory, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import styled from 'styled-components';

// local imports
import APIRequest from '../../../hooks/apiHook';
import { getPathRoot } from '../../../utils/helpers';
import PDModalCard from '../modal/PDModalCard';
import '../ProductDetail.css';
import WidgetLoader from '../../common/WidgetLoader/WidgetLoader';

const SpinnerDivWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const [modal] = useState(true);

  // Close modal function.
  //
  // If filterTarget flag is true only elements with a
  // class of "close-modal" will close the modal.
  const handleClose = (e, filterTarget) => {
    if (filterTarget && !e.target.classList.contains('close-modal')) return;
    return history.push(pathRoot);
  };

  // load product data
  const { loading, error, response } = APIRequest(`/products/${id}`, 'get');

  // if no product found go to path root i.e. /shop, /new, /deals
  if (error) {
    history.replace(pathRoot);
    return null;
  }

  /* If loading return spinner else Product Detail Modal */
  const modalContent = loading ? (
    <SpinnerDivWrapper>
      <WidgetLoader />
    </SpinnerDivWrapper>
  ) : (
    <PDModalCard
      handleClose={handleClose}
      product={response.product}
      innerContentOnly="true"
    />
  );

  return (
    <Modal
      isOpen={modal}
      toggle={handleClose}
      className="ProductDetail"
      size="xl"
      centered
    >
      <div onClick={e => handleClose(e, true)}>{modalContent}</div>
    </Modal>
  );
};

export default ProductDetail;
