/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Ignis       from './ignis';
import Parser      from 'body-parser';

/* Parse JSON bodies before attaching Passport.js */
Ignis.root.use(Parser.json());

/*!
 * Ignis extension packages.
 */
Ignis.use(require('./error'));
Ignis.use(require('./config'));
Ignis.use(require('./data'));
Ignis.use(require('./routing'));

/* Passport.js authentication strategies */
Ignis.use(require('./auth'));

/* Authorized access sontrol */
Ignis.use(require('./access'));

export default Ignis;
