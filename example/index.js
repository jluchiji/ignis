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
Ignis.error({ status: 404 }, function(err, req, res, next) {
  res.status(404).send('<h1>It\'s Gone!</h1><p>' + err.message + '</p>');
});
Ignis.error(null, function(err, req, res, next) {
  res.status(500).send(err.message);
});


Ignis.listen(3000);
