import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// local imports
import PageFadeSlideTransition from '../../components/PageTransition/PageFadeSlideTransition/PageFadeSlideTransition';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import StorePageRoutes from '../../routes/storePageRoutes';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductList from '../../components/ProductList/ProductList';
import { SpacerDiv } from '../../components/common/utils/SpacerDiv';
import { getPathRoot } from '../../utils/helpers';

const NewProducts = () => {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  // searchbar / productlist state.
  // Used for SearchBar inital form state setting base category
  const initFormState = useRef({ category: 'newProducts' });
  // params that get passed to GET:/products request to filter products in response
  const [params, setParams] = useState(initFormState.current);

  return (
    <PageFadeSlideTransition>
      <ProductPanel
        title={'New Products'}
        byline={'Check out our newest items!'}
      >
        <SearchBar
          params={params}
          setParams={setParams}
          initFormState={initFormState.current}
        />
        <ProductList params={params} />
      </ProductPanel>
      <SpacerDiv height={'100px'} />

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={2} />
      {/* End Routes. */}
    </PageFadeSlideTransition>
  );
};

export default NewProducts;
