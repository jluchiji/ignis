/**
 * access/action.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Authorized  from 'authorized';


/**
 * action(2)
 *
 * @description                Registers an action with authorized.
 * @param          {name}      Name of the action to register.
 * @param          {roles...}  Roles required for the action.
 */
export function action(name, roles) {
  Authorized.action(name, roles);
}


/*!
 * Ignis extension.
 */
export default function accessAction(ignis) {
  ignis.access.action = action;
}
