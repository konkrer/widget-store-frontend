import RingLoader from 'react-spinners/RingLoader';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/core';

const overide = css`
  display: block;
  margin: auto;
  position: absolute;
  margin-top: -35px;
  margin-left: -87px;
  border-width: 6px;
  border-style: dotted;
`;

const WidgetLoader = () => (
  <div className={'position-relative d-inline-block m-5'}>
    <ClipLoader size={175} css={overide} />
    <div
      style={{
        height: '100px',
        width: '100px',
        display: 'inline-block',
        marginLeft: '-100px',
      }}
    >
      <RingLoader size={100} color={'blue'} />
      <RingLoader size={100} color={'red'} />
      <RingLoader size={100} color={'yellow'} />
    </div>
  </div>
);

export default WidgetLoader;
