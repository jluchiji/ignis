/**
 * config/envar.js
 *
 * @author  Denis-Luchkin-Zhou
 * @license MIT
 */

/*!
 * Ignis.js extension.
 */
export default function envar(ignis) {
  Object
    .keys(process.env)
    .forEach(key => ignis.config(key, process.env[key]));
}
