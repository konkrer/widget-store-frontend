# Widget Store

## Generic Storefront with payment integration.

[![Node.js CI](https://github.com/konkrer/widget-store-frontend/actions/workflows/node2.js.yml/badge.svg)](https://github.com/konkrer/widget-store-frontend/actions/workflows/node2.js.yml)
[![Push to Surge workflow](https://github.com/konkrer/widget-store-frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/konkrer/widget-store-frontend/actions/workflows/node.js.yml)

[https://melted-sidewalk.surge.sh](https://melted-sidewalk.surge.sh 'Widget Store')

## Project Description
*This project was done as a final Capstone project for the Springboard Software Engineering Career Track program. This project was chosen for it's technical challenge in creating a secure, reliable application from the ground up for e-commerce.*  

A generic e-commerce storefront built as a single page application (SPA) using React/Redux in the front-end, an Express based API service using a PostgreSQL database in the back-end including Braintree payment processor integration in the front and back end. This app can currently process credit card and PayPal payments in a sandbox environment.  

For maximum application security and stability this app employs extensive test coverage (100%) in the front and back end.

To ensure a secure ordering flow this app employs a transaction based approach to order creation in the back-end server with only valid orders able to be completed. As soon as an order is received (in the back-end) the integrity of the order is checked. Tampering with the order data sent from the front-end, insufficient quantity (stock) of products, or any payment processing problems or errors all result in transaction failure. While proper logging of such events is not currently implemented it is duly noted that logging would be implemented if this app were to be further developed.  

To ensure accuracy of money related calculations this app employs Decimal.js in the front and back end to avoid pitfalls of floating point based calculations when dealing with discreet monetary values. The PostgreSQL database in the back-end declares the Numeric type for all monetary values ensuring database calculations also avoid any floating point pitfalls when dealing with monetary calculations.  

This app employs custom animations to add application interactivity, feedback, and to make obvious the single page nature of this app as the application's various pages are navigated.

## Notable Features

- 100% test coverage.
- Reliable and secure checkout functionality.
- Functioning payment integration. (Note: shipping costs calculation is faked)
- Animations to add app interactivity.


## Use
#### Testing payment functionality on checkout page:

    Use Credit Card #4111 1111 1111 1111 | Expiration Date 2/22 | CVV #222

###### Install

    npm i

###### Project Scripts

    1. npm start               - run react development server.
    2. npm test                - run test suite.
    3. npm run test:coverage   - run test suite with istanbul coverage report.
    4. npm run test:debug      - debug tests with inspector - e.g.-> chorme:inspector.

## About

### Tech Stack




- React  
\- front-end library  

- Redux  
\-state management  

- Redux Persist  
\-state persistence  

- React-Router-Dom  
\- single page routing allowing nested routes  

- Jest  
\- testing library  

- Istanbul  
\- testing coverage reports  

- Braintree Payments  
\- Payment Processor  

- Bootstrap  
\- CSS framework  

- Styled Components  
\- provides CSS in JS capability   

- Formik  
\- react form management  

- Yup  
\- Form entry error checking  

- Framer Motion  
\-  animation library  

- Decimal.js  
\- utility class for discreet value calculations 
 
- Axios  
\- AJAX requests

##### Backend Server Repository:

https://github.com/konkrer/widget-store-backend

###### Test Coverage

![100% test coverage](https://repository-images.githubusercontent.com/323088197/60d15100-70c9-11eb-97eb-610cc2555380)
