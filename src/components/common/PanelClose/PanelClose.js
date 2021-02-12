// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const PanelClose = ({ closeFunct }) => (
  <div className="Panel-close">
    <button className="btn-noStyle" onClick={closeFunct} aria-label="close">
      <FontAwesomeIcon icon={faWindowClose} size={'2x'} />
    </button>
  </div>
);

export default PanelClose;
