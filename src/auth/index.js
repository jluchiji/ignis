/**
 * auth/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Passport    from 'passport';
import { local }   from './strategy-local';
import { token }   from './strategy-token';


/**
 * factory(1)
 *
 * @description                Authentication middleware factory.
 * @param          {ignis}     Ignis.js namespace.
 * @param          {strategy}  Name of the strategy to apply.
 * @param          {options}   Options to pass to the middleware.
 * @returns        {Function}  Express.js middleware instance.
 */
export function instance(ignis, strategy, options) {
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
  ignis.factories.push(instance);
  ignis.middleware.push(Passport.initialize());

  /* Authentication mechanisms */
  ignis.auth.local = local;
  ignis.auth.jwt   = token;

}
