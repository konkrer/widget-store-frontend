// package imports
import styled from 'styled-components';

// local imports
import img from '../../assets/images/clockwork-gears.jpg';

const Background = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1000;
  background: url('${img}');
  background-position: center;
  background-size: cover;
`;

export default Background;
