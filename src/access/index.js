/**
 * access/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Authorized  from 'authorized';

import Role        from './role';
import Scope       from './scope';
import Action      from './action';
import { __scopes } from './scope';

/**
 * accessFactory(2)
 *
 * @description                Factory for instantiating access control mware.
 * @param          {ignis}     Ignis.js instance.
 * @param          {meta}      Request handler metadata.
 * @return         {Function}  Express middleware that authorizes the request.
 */
export function accessFactory(ignis, meta) {
  let action = meta.access || meta.action || meta.permission;

  /* Do not add anything if action is not specified */
  if (!action) { return null; }

  /* Action can be either a string or an array */
  action = _.flatten([action]);

  /* Create an authorization middleware */
  return Authorized.can(...action);
}


/*!
 * Ignis extension
 */
export default function accessExtension(Ignis) {
  Ignis.init(function() {
    /* Root acess-control namespace */
    this.access = Object.create(null);

    /* Scope storage */
    this[__scopes] = new Map();

    /* Attach Authorized middlewares */
    this.factories.push(accessFactory);

    /* Attach access-control callbacks */
    this.access.role   = Role;
    this.access.scope  = Scope.bind(this);
    this.access.action = Action;
  });

}
