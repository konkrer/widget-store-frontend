import React from 'react';
import styled from 'styled-components';

const AddressSecton = styled.section`
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  --addressHeadingSize: inital;
  max-width: 40%;
  margin-right: 2rem;
  min-width: 200px;

  @media screen and (max-width: 1199.9px) {
    max-width: 40%;
    margin-right: 1.8rem;
  }

  @media screen and (max-width: 991.9px) {
    max-width: 30%;
    margin-right: 1.9rem;
  }

  @media screen and (max-width: 767.9px) {
    max-width: 25%;
    min-width: 180px;
    margin-right: 0.8rem;
  }

  @media screen and (max-width: 575.9px) {
    font-size: small;
    --addressHeadingSize: small;
    margin-right: 1.1rem;
    min-width: 140px;
  }

  @media screen and (min-width: 1200px) {
    margin-right: 2.5rem;
  }
`;

const AddressBox = ({
  title,
  customer,
  isShippingAddress,
  isTextBox,
  text,
  button,
  className,
}) => {
  if (!customer && !isTextBox) return null;

  return (
    <AddressSecton className={className}>
      <div>
        <h6
          className="text-info font-weight-bold"
          style={{ fontSize: 'var(--addressHeadingSize)' }}
        >
          {title}
        </h6>
        {!isTextBox && (
          <address className="bg-white p-2 text-dark rounded border">
            {customer.first_name} {customer.last_name}
            <br />
            {!isShippingAddress && customer.email}
            <br />
            {customer.phone_number}
            {customer.phone_number && <br />}
            {customer.address}
            <br />
            {customer.address_line2}
            {customer.address_line2 && <br />}
            {customer.city}, {customer.state} {customer.postal_code}
          </address>
        )}
        {isTextBox && (
          <div className="bg-light p-2 text-dark rounded">{text}</div>
        )}
      </div>

      {button && button}
    </AddressSecton>
  );
};

export default React.memo(AddressBox);
