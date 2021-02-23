import styled from 'styled-components';

// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const PanelCloseDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.6rem;
  color: black;
`;

const PanelClose = ({ closeFunct }) => (
  <PanelCloseDiv className="PanelClose">
    <button className="btn-noStyle" onClick={closeFunct} aria-label="close">
      <FontAwesomeIcon icon={faWindowClose} size={'2x'} />
    </button>
  </PanelCloseDiv>
);

export default PanelClose;
