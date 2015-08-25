/**
 * data/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Model       from './model';
import Source      from './source';


/*!
 * Ignis extension
 */
export default function data(ignis) {
  Source(ignis);
  Model(ignis);
}
