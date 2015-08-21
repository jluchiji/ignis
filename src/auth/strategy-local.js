/**
 * auth/strategy-local.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Bluebird    from 'bluebird';
import Passport    from 'passport';
import * as Local  from 'passport-local';


/**
 * local(2)
 *
 * @description    Specifies the callback function for verifying local login.
 * @param          {options}   [Optional] Passport.js strategy options.
 * @param          {callback}  Function that verifies the login.
 */
export function local(callback) {
  let options  = Object.create(null);
  if (arguments.length === 2) {
    options  = arguments[0];
    callback = arguments[1];
  }

  let wrapper = function(username, password, done) {
    return Bluebird
      .try(() => { return callback(username, password); })
      .nodeify(done);
  };

  Passport.use(new Local.Strategy(options, wrapper));
}


/*!
 * Extension
 */
export default function localAuth(ignis) {
  ignis.auth = _.assign(ignis.auth || { }, { local: local });
}
