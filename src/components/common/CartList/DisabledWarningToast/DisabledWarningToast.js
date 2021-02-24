import { Toast } from 'react-bootstrap';

const DisabledWarningToast = ({ show, toggle }) => (
  <Toast
    show={show}
    onClose={toggle}
    className="text-dark position-absolute"
    style={{ width: '32ch' }}
    delay={5000}
    autohide
  >
    <Toast.Header className="bg-warning">
      <strong className="mr-auto">Quantity adjust disabled!</strong>
    </Toast.Header>
    <Toast.Body className="bg-light">
      Click "Customer Information" button to adjust quantity.
    </Toast.Body>
  </Toast>
);

export default DisabledWarningToast;
