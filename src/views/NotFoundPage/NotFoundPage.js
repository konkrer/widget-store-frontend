import { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';

// local imports
import { FramerRedirect } from '../../helpers/helpers';

const FlexOverlay = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--dark);
`;

const NotFoundPage = () => {
  const [redirectHome, setRedirectHome] = useState(false);

  if (redirectHome) return <FramerRedirect to="/shop" />;

  return (
    <FlexOverlay>
      <section className="lead text-light">
        <h1>404 Page Not Found</h1>
        <Button color="primary" size="lg" onClick={setRedirectHome}>
          Go Home
        </Button>
      </section>
    </FlexOverlay>
  );
};

export default NotFoundPage;
