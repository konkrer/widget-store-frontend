import { Redirect } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Given a path return the "root" argument.
 * For example the "root" of /shop/product/206 would be "/shop".
 *
 * @param {string} path
 */

export const getPathRoot = path => {
  return path.match(/^(\/\w*)\/?.*$/)[1];
};

export const FramerRedirect = props => (
  <motion.div exit="undefined">
    <Redirect {...props} />
  </motion.div>
);

export const animateVariant = (setterFunct, delay, callback, args = []) => {
  // if animation state is false set to 'default' else 'active'
  setterFunct(state => (state === false ? 'default' : 'active'));
  setTimeout(() => {
    setterFunct('default');
    if (callback) callback(...args);
  }, delay);
};
