import styled from 'styled-components';

const ModalCard = styled.div`
  width: 70vw;
  background: white;
  opacity: 1;
  border-radius: 7px;
  margin-bottom: 5vh;
  color: ${p => p.color || 'inherit'};

  @media screen and (max-width: 991.9px) {
    width: 80vw;
  }
  @media screen and (max-width: 767.9px) {
    width: 90vw;
  }
  @media screen and (max-width: 575.9px) {
    width: 95vw;
  }
`;

export default ModalCard;
