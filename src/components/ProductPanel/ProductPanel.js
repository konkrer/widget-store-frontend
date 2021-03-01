import Container from 'react-bootstrap/Container';
import './ProductPanel.css';

const ProductPanel = props => (
  <Container
    className={`ProductPanel panel-border my-4 mt-xl-5 py-4 dark-gradient-1 px-2 px-xl-5 boxShadowLarge ${props.className}`}
    fluid="xl"
  >
    <header>
      <h1
        className={`brand-style textShadowLarge display-${
          props.display ? props.display : 1
        }`}
      >
        {props.title}{' '}
      </h1>
      <h2 className="lead text-xl font-italic mb-3 ProductPanel-byline mt-3">
        {props.byline}
      </h2>
      {props.headerHTML}
    </header>

    {props.component || props.children}
  </Container>
);

export default ProductPanel;
