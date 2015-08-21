/**
 * auth/strategy-token.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Bluebird    from 'bluebird';
import Passport    from 'passport';
import * as JWT    from 'passport-jwt';


/**
 * token(2)
 *
 * @description    Specifies the callback function for verifying token login.
 * @param          {options}   [Optional] Passport.js strategy options.
 * @param          {callback}  Function that verifies the login.
 */
export function token(callback) {
  let options  = Object.create(null);
  if (arguments.length === 2) {
    options  = arguments[0];
    callback = arguments[1];
  }

  let wrapper = function(token, done) {
    return Bluebird
      .try(() => { return callback(token); })
      .nodeify(done);
  };

  Passport.use(new JWT.Strategy(options, wrapper));
}


/*!
 * Extension
 */
export default function localAuth(ignis) {
  ignis.auth = _.assign(ignis.auth || { }, { token: token });
}
