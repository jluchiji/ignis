/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Ignis       from './core';

/*!
 * Ignis extension packages.
 */
Ignis.use(require('./error'));
Ignis.use(require('./config'));
Ignis.use(require('./data'));
Ignis.use(require('./routing'));

const  instance = new Ignis();
export default instance;
