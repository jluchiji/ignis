/**
 * auth/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Passport    from 'passport';
import * as JWT    from 'passport-jwt';
import * as Local  from 'passport-local';

import Strategy    from './strategy';



/**
 * passportFactory(2)
 *
 * @description                Authentication middleware factory.
 * @param          {ignis}     Ignis.js namespace.
 * @param          {options}   Strategy name or an options object.
 * @returns        {Function}  Express.js middleware instance.
 */
export function passportFactory(ignis, options) {
  let strategy = options;
  if (typeof options === 'object') {
    strategy = options.strategy;
    delete options.strategy;
  } else {
    options = { };
  }

  /* Resolve aliases first */
  strategy = ignis.auth.__alias[strategy] || strategy;

  /* Create the corresponding middleware */
  options = _.merge({ }, ignis.auth.__options, options);
  return Passport.authenticate(strategy, options);
}


/**
 * auth(1)
 *
 * @description                Ignis.js extension.
 */
export default function auth(ignis) {

  /* Root authentication namespace */
  ignis.auth = Object.create(null);
  ignis.auth.__alias   = { 'token': 'jwt' };
  ignis.auth.__options = { session: false };

  /* Attach passport.js middlewares */
  ignis.factories.push(passportFactory);
  ignis.middleware.push(Passport.initialize());

  /* Authentication mechanisms */
  ignis.auth.jwt   = Strategy(JWT.Strategy);
  ignis.auth.local = Strategy(Local.Strategy);

}
