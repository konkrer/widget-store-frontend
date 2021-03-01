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

const WidgetLoader = ({ size = 100 }) => (
  <div className={'position-relative d-inline-block m-5'}>
    <ClipLoader size={size * 1.75} css={overide} />
    <div
      style={{
        height: `${size}px`,
        width: `${size}px`,
        display: 'inline-block',
        marginLeft: `-${size}px`,
      }}
    >
      <RingLoader size={size} color={'blue'} />
      <RingLoader size={size} color={'red'} />
      <RingLoader size={size} color={'yellow'} />
    </div>
  </div>
);

export default WidgetLoader;
