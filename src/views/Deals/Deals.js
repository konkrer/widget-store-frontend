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
import './Deals.css';

const Deals = () => {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  // searchbar / productlist filtering
  const initFormState = useRef({ category: 'deals' });
  const [params, setParams] = useState(initFormState.current);

  return (
    <PageFadeSlideTransition>
      <ProductPanel title={'Deals'} byline={"Here's what's on sale!"}>
        <SearchBar
          setParams={setParams}
          initFormState={initFormState.current}
        />
        <ProductList params={params} />
      </ProductPanel>
      <SpacerDiv height={'100px'} />

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={1} />
      {/* End Routes. */}
    </PageFadeSlideTransition>
  );
};

export default Deals;
