import styled from 'styled-components';

// background to fade page behind open cart
const ScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;

  @media screen and (max-width: 991.9px) {
    justify-content: flex-start;
  }
`;

export default ScreenBackground;
