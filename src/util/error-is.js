/**
 * util/error-is.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';

/**
 * errorIs(2)
 *
 * @description                Checks whether the error is of the specified
 *                             criteria:
 *                               1) falsy: returns true;
 *                               2) function: checks whether error is instance
 *                                  of the given constructor;
 *                               3) string: checks if error name is equal the
 *                               		string, case insesitive;
 *                               4) regex: checks if error name matches the
 *                               		regex;
 *                               5) otherwise: throw.
 * @param          {error}     The error instance to check.
 * @param          {criteria}  The type to check against, see description.
 * @return         {boolean}   True if error matches, false otherwise.
 */
export default function errorIs(error, criteria) {

  /* This function only deals with errors! */
  if (!(error instanceof Error)) { return false; }

  /* Falsy criteria matches everything (catch-all) */
  if (!criteria) { return true; }

  /* If criteria is a constructor... */
  if (typeof criteria === 'function') {
    return (error instanceof criteria);
  }

  let name = error.name || (error.constructor && error.constructor.name) || '';

  /* If criteria is a string... */
  if (typeof criteria === 'string') {
    return (name.toLowerCase() === criteria.toLowerCase());
  }

  /* If criteria is a regex... */
  if (criteria instanceof RegExp) {
    return criteria.test(name);
  }

  /* Object: do a deep match */
  if (typeof criteria === 'object') {
    return _.every(
      Object.keys(criteria),
      (key) => _.matchesProperty(key, criteria[key])(error)
    );
  }

  /* Have no idea what the criteria is... */
  throw new Error(`Unexpected criteria type: ${criteria}`);

}
