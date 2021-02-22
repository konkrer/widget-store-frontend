import Container from 'react-bootstrap/Container';

const ProductPanel = props => (
  <Container
    className="Product Panel my-4 mt-xl-5 py-4 dark-gradient1 rounded px-2 px-xl-5 boxShadowLarge"
    fluid="xl"
  >
    <h1 className="brand-style textShadowLarge display-1">{props.title} </h1>
    <h2 className="lead font-italic mb-4 Home-byline mt-3">{props.byline}</h2>
    {props.component || props.children}
  </Container>
);

export default ProductPanel;
