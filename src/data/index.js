/**
 * data/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import * as Model  from './model';
import * as Source from './source';


/*!
 * Ignis extension
 */
export default function data(Ignis) {
  Ignis.prototype.model  = Model.model;
  Ignis.prototype.source = Source.source;

  Ignis.init(function() {
    this[Model.__models] = new Map();
    this[Source.__sources] = new Map();
  });
}
