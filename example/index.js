/**
 * example/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Ignis          = require('ignis');

require('./source');
require('./model');

Ignis.endpoint('/countries', require('./handler'));

Ignis.listen(3000);
