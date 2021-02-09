/** Full page static background element. */

// package imports
import styled from 'styled-components';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1000;
  background: ${p => p.background};
  background-position: center;
  background-size: cover;
`;

export default Background;
