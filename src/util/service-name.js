/**
 * util/service-name.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';

/* These suffixes are removed before normalizing the name */
const suffixes = /(service)$/i;


/**
 * Normalizes the name of a service.
 */
export default function serviceName(service) {

  /* Remove the suffixes */
  let name = service.name.replace(suffixes, '');

  /* Convert to kebab-case */
  name = _.kebabCase(name);

  return name;
}
