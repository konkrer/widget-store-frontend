import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

// local imports
import { FramerLink } from '../../utils/helpers';

const FlexOverlay = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--dark);
`;

const NotFoundPage = () => {
  return (
    <FlexOverlay>
      <section className="lead text-light">
        <h1>404 Page Not Found</h1>
        <FramerLink to="/shop">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </FramerLink>
      </section>
    </FlexOverlay>
  );
};

export default NotFoundPage;
