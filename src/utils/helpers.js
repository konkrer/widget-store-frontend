import { Redirect, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * getPathRoot()
 *
 * Given a path return the "root" argument.
 * For example the "root" of /shop/product/206 would be "/shop".
 *
 * @param {string} path
 */

export const getPathRoot = path => {
  return path.match(/^(\/\w*)\/?.*$/)[1];
};

/**
 * <FramerRedirect to="" />
 *
 * Component to force react-router-dom redirect when framer-motion
 * prevents a redirect from executing.
 *
 * If regular <Redirect /> fails in this environment use this redirect instead.
 *
 * @param {any} props
 *
 * returns: motion.div wrapped redirect component
 */
export const FramerRedirect = props => (
  <motion.div exit="undefined">
    <Redirect {...props} />
  </motion.div>
);

/**
 * <FramerLink to="" />
 *
 * Component to force react-router-dom link when framer-motion
 * prevents a link from working.
 *
 * If regular <Link /> fails in this environment use this Link instead.
 *
 * @param {any} props
 *
 * prefix props with "wrapper_" to have props apply to Link wrapper.
 * i.e. - wrapper_classname="d-inline-block".
 *
 * returns: motion.div wrapped redirect component
 */

export const FramerLink = props => {
  const wrapperProps = {},
    linkProps = {};
  // seperate wrapper props from link props
  Object.entries(props).forEach(([key, val]) => {
    if (key.startsWith('wrapper_')) wrapperProps[key.slice(8)] = val;
    else linkProps[key] = val;
  });

  return (
    <motion.div exit="undefined" {...wrapperProps}>
      <Link {...linkProps} />
    </motion.div>
  );
};

/**
 * animateVariant()
 *
 * Animation function to turn on an animation state then turn it back
 * off after a delay. The state will be set "active" then back to "default".
 *
 * If inital state provided by setterFunct is false this function will skip
 * setting the animation state "active" instead set it to "default".
 *
 * If a callback is provided it will be called with any arguments
 * after setting state back to "default" in the timeout.
 *
 *
 * @param {function} setterFunct - useState setter funct to set animation state
 * @param {integer} delay - delay of setterFunct being called
 * @param {funct} callback - function to call upon completion
 * @param {array} args - array of arguments for callback function
 */

export const animateVariant = (setterFunct, delay, callback, args = []) => {
  // if animation state is false set to 'default' else 'active'
  setterFunct(state => (state === false ? 'default' : 'active'));
  // after delay set back to "default"
  return setTimeout(() => {
    setterFunct('default');
    if (callback) callback(...args);
  }, delay);
};
