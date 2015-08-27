/**
 * example/handler.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Ignis          = require('ignis');


/*!
 * Here we define the request handler.
 */
var getByCode = {
  path: 'GET /:code',
  handler: function(req) {
    var Countries = Ignis.model('countries');
    return Countries.findByCode(req.params.code);
  }
};

var getAll = {
  path: 'GET /',
  handler: function(req) {
    var Countries = Ignis.model('countries');
    return Countries.list();
  }
};

module.exports = function(root, ignis) {

  ignis.mount(root, getByCode);
  ignis.mount(root, getAll);

};
