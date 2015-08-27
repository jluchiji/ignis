/**
 * example/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Ignis          = require('ignis');

var _              = require('lodash');

/*!
 * Here we define a model on the data.
 */
Ignis.model('countries', 'sample', function(data) {

  this.findByCode = function(code) {
    code = code.toLowerCase();
    var result = _.find(data, function(i) {
      return (i.code.toLowerCase() === code);
    });

    if (!result) { Ignis.Error.notFound('Country not found:' + code); }

    return result.name;
  };

  this.list = function() {
    return _.values(data);
  };

});
