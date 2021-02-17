import { Container } from 'reactstrap';

// local imports
import ProductList from '../../components/ProductList/ProductList';

const ProductPanel = props => (
  <Container
    className="my-4 py-4 Home dark-gradient1 rounded px-2 px-xl-5"
    fluid="xl"
  >
    <h1 className="brand-style">{props.title} </h1>
    <h2 className="lead font-italic mb-4 Home-byline">{props.byline}</h2>
    <ProductList />
  </Container>
);

export default ProductPanel;
