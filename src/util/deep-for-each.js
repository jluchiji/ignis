/**
 * util/deep-for-each.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';

export default function deepForEach(obj, iterator = _.noop) {

  _.forEach(obj, (v, k) => {
    iterator(v, k, obj);
    if (typeof v === 'object') {
      deepForEach(v, iterator);
    }
  });

}
