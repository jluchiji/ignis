/**
 * access/role.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Bluebird    from 'bluebird';
import Authorized  from 'authorized';

import Unpromisify from '../util/unpromisify';


/**
 * role(2)
 *
 * @description                Specifies the callback for verifying a role.
 * @param          {name}      Name of the role without entity.
 * @param          {callback}  Promise-generating callback function.
 */
export function role(name, callback) {
  callback = Unpromisify(callback);

  let wrapped = (req, done) => {
    callback(req, done);
  };
  if (/\./.test(name)) {
    wrapped = (ent, req, done) => {
      callback(ent, req, done);
    };
  }

  Authorized.role(name, wrapped);
}


/*!
 * Ignis extension
 */
export default function accessRole(ignis) {
  ignis.access.role = role;
}
