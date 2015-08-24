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

import Strategy       from './strategy';
import { IgnisError } from '../error';



/**
 * passportFactory(2)
 *
 * @description                Authentication middleware factory.
 * @param          {ignis}     Ignis.js namespace.
 * @param          {handler}   Ignis.js request handler with metadata.
 * @returns        {Function}  Express.js middleware instance.
 */
export function passportFactory(ignis, handler) {
  let options  = handler.auth || handler.authenticate || handler.authentication;
  let strategy = options;
  if (typeof options === 'object') {
    strategy = options.strategy;
    delete options.strategy;
  } else {
    options = { };
  }

  /* Generate nothing if strategy is 'none' or falsy */
  if (!strategy || /^none$/i.test(strategy)) { return null; }

  /* Resolve aliases first */
  strategy = ignis.auth.__alias[strategy] || strategy;

  /* Create the corresponding middleware */
  options = _.merge({ }, ignis.auth.__options, options);
  return function(req, res, next) {
    let callback = passportCallback(req, res, next);
    Passport.authenticate(strategy, options, callback)(req, res, next);
  };
}


/**
 * passportCallback(3)
 *
 * @description                Creates a custom callback function so that
 *                             authentication errors go through Express.js
 *                             error handler stack instead of having Passport.js
 *                             send out a 401 response.
 * @param          {err}       Error occured during authentication.
 * @param          {user}      User information (if authentication successful).
 * @param          {info}      Additional information.
 */
export function passportCallback(req, res, next) {
  return function(err, user, info) {
    if (err) { return next(err); }

    if (!user) {
      let error = new IgnisError(401, 'Authentication Failed', {
        sensitive: true,
        reason: info
      });
      return next(error);
    }

    next();
  };
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
