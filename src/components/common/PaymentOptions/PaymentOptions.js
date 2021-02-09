// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcJcb,
  faPaypal,
} from '@fortawesome/free-brands-svg-icons';

const PaymentOptions = () => (
  <div className="d-flex justify-content-center text-dark mt-4">
    <div className="mx-2">
      <FontAwesomeIcon icon={faPaypal} size={'lg'} />
    </div>
    <div className="mx-2">
      <FontAwesomeIcon icon={faCcVisa} size={'lg'} />
    </div>
    <div className="mx-2">
      <FontAwesomeIcon icon={faCcMastercard} size={'lg'} />
    </div>
    <div className="mx-2">
      <FontAwesomeIcon icon={faCcAmex} size={'lg'} />
    </div>
    <div className="mx-2">
      <FontAwesomeIcon icon={faCcDiscover} size={'lg'} />
    </div>
    <div className="mx-2">
      <FontAwesomeIcon icon={faCcJcb} size={'lg'} />
    </div>
  </div>
);

export default PaymentOptions;
