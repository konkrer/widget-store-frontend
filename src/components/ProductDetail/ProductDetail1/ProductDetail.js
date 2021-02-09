/** Product Detail Modal Type 1
 *
 * Shows product details on a Bootstrap (reactstrap) modal.
 */

import { useParams, useHistory, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Modal } from 'reactstrap';

// local imports
import APIRequest from '../../../hooks/apiHook';
import { getPathRoot } from '../../../helpers/helpers';
import PDModal from '../PDModalCard';
import '../ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  // close modal function
  const handleClose = e => {
    return history.push(pathRoot);
  };

  // modal variables
  const [modal] = useState(true);

  // load product data
  const { loading, error, response } = APIRequest(`/products/${id}`, 'get');

  // if no product found go to path root i.e. /shop, /new, /deals
  if (error) {
    history.replace(pathRoot);
    return null;
  }
  if (loading) return null;

  const product = response.product;

  return (
    <Modal
      isOpen={modal}
      toggle={handleClose}
      className="ProductDetail"
      size="xl"
      centered
    >
      <PDModal
        product={product}
        handleClose={handleClose}
        innerContentOnly="true"
      />
    </Modal>
  );
};

export default ProductDetail;
