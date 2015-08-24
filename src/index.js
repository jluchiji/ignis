/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Ignis       from './ignis';


/*!
 * Ignis root functions.
 */
Ignis.use(require('./error'));
Ignis.use(require('./config'));
Ignis.use(require('./config/envar'));
Ignis.use(require('./data/model'));
Ignis.use(require('./data/source'));


/* Passport.js authentication strategies */
Ignis.use(require('./auth'));


export default Ignis;
