import { useState } from 'react';

const useToggle = initialState => {
  const [state, setstate] = useState(initialState);

  const toggleState = () => setstate(state => !state);

  return [state, toggleState];
};

export default useToggle;
