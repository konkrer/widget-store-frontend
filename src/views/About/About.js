/** AboutPage page view. */

import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

// local imports
import PageFadeSlideTransition from '../../components/PageTransition/PageFadeSlideTransition/PageFadeSlideTransition';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import GeneralPageRoutes from '../../routes/generalPageRoutes';
import { SpacerDiv } from '../../components/common/utils/SpacerDiv';
import { getPathRoot } from '../../utils/helpers';
import './About.css';
//images
import springboardLogo from '../../assets/images/Springboard_logo.png';
import widgetLogo from '../../assets/images/brandIcon.png';

const StyledSection = styled.section`
  max-width: 75ch;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding-top: 2rem;
`;

const StyledP = styled.p`
  color: var(--light);
  margin-bottom: 2.5rem;
  font-size: large;

  &::first-letter {
    color: red;
    font-size: 2.5rem;
    font-family: Lobster, cursive;
    -webkit-font-smoothing: antialiased;
    line-height: 0.5;
  }
`;

const AboutPage = () => {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  const headerHTML = (
    <>
      <h6 className={'text-light mb-0'}>
        <i className="text-info">Created by:</i> Richard Iannucelli
      </h6>
      <a
        className="btn btn-secondary btn-sm mt-4 px-5 py-1"
        href="https://github.com/konkrer"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} size="2x" />{' '}
      </a>
    </>
  );

  return (
    <PageFadeSlideTransition>
      <ProductPanel
        title={'Widget Store'}
        byline={'E-commerce Website Project'}
        bylineAs={'h4'}
        headerHTML={headerHTML}
        className="AboutPage"
      >
        <StyledSection>
          <hr className="border-secondary mb-5" />
          <StyledP>
            This project was done as a final Capstone project for the
            <img
              src={springboardLogo}
              height={30}
              widht={30}
              style={{ marginTop: '-5px' }}
              alt="Springboard logo"
            />
            Springboard Software Engineering Career Track program. This project
            was chosen for the technical challenge in creating a secure,
            reliable application from the ground up for e-commerce.
          </StyledP>
          <StyledP>
            A generic e-commerce storefront built as a single page application{' '}
            <FontAwesomeIcon
              icon={faCreditCard}
              className="float-right ml-1 font-size-50 text-secondary"
              alt="Credit card icon"
            />
            (SPA) using React/Redux in the front-end, an Express based API
            service using a PostgreSQL database in the back-end including having
            Braintree payment processor integration in the front and back end.
            <FontAwesomeIcon
              icon={faPaypal}
              className="float-left mr-2 font-size-50 text-secondary"
              alt="Paypal logo"
            />
            This app can currently process credit card and PayPal payments in a
            sandbox environment.
          </StyledP>
          <StyledP>
            For maximum application security and stability this app employs
            extensive test coverage (100%) in the front and back end.
          </StyledP>
          <StyledP>
            To ensure a secure ordering flow this app employs a transaction
            based approach to order creation in the back-end server with only
            valid orders able to be completed. As soon as an order is received
            (in the back-end) the integrity of the order is checked. Tampering
            with the order data sent from the front-end, insufficient quantity
            (stock) of products, or any payment processing problems or errors
            all result in transaction failure.
          </StyledP>
          <StyledP>
            To ensure accuracy of money related calculations this app employs
            Decimal.js in the front and back end to avoid any pitfalls of
            floating-point based calculations when dealing with discreet
            monetary values. The PostgreSQL database in the back-end declares
            the Numeric type for all monetary values ensuring database
            calculations also avoid any floating-point issues when dealing with
            monetary calculations.
          </StyledP>
          <StyledP>
            Custom animations are employed to add application interactivity,
            feedback, and to make obvious the single page nature of this app as
            the application's various pages are navigated.
          </StyledP>
        </StyledSection>
        <img
          src={widgetLogo}
          height="100"
          width="100"
          alt="widget store brand logo"
          className="my-3"
        />
      </ProductPanel>
      <SpacerDiv height={'100px'} />

      {/* Nested Routes for cart, and login. */}
      <GeneralPageRoutes pathRoot={pathRoot} />
      {/* End Routes. */}
    </PageFadeSlideTransition>
  );
};

export default AboutPage;
