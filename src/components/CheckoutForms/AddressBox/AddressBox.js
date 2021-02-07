import React from 'react';
import styled from 'styled-components';

const AddressSecton = styled.section`
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  --addressHeading: inital;
  max-width: 40%;
  margin-right: 2.5rem;
  min-width: 160px;

  @media screen and (max-width: 575px) {
    font-size: small;
    --addHeadingress: small;
    margin-right: 1.5rem;
    min-width: 110px;
  }

  @media screen and (max-width: 992px) and (orientation: landscape) {
    max-width: 28%;
    margin-right: 2rem;
  }

  @media screen and (min-width: 1200px) {
    min-width: 200px;
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
          style={{ fontSize: 'var(--addHeadingress)' }}
        >
          {title}
        </h6>
        {!isTextBox && (
          <address className="bg-light p-2 text-dark rounded border border-dark">
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
