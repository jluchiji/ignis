/**
 * util/service-name.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import DataSource  from '../data-source';

/* These suffixes are removed before normalizing the name */
const suffixes = /(service|datasource|model)$/i;


/**
 * Normalizes the name of a service.
 */
export default function serviceName(service) {

  /* Remove the suffixes */
  let name = service.name.replace(suffixes, '');

  /* Convert to kebab-case */
  name = _.kebabCase(name);

  /* If this is a data source, prepend 'data:' */
  if (service.prototype instanceof DataSource) {
    name = 'data:' + name;
  }

  return name;
}
