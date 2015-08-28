/**
 * config/envar.js
 *
 * @author  Denis-Luchkin-Zhou
 * @license MIT
 */

import Debug       from 'debug';
const  debug = Debug('ignis:envar');

/**
 * env(1)
 *
 * @description                Import specified environment variables into the
 *                             Ignis config.
 * @param          {fields}    Object whose keys are envar names, and values
 *                             are string descriptions of the parameter.
 */
export default function env(fields) {
  Object
    .keys(fields)
    .forEach(key => {
      if (typeof process.env[key] === 'undefined') {
        debug(`Ignis::config::envar(): Missing ${key}`);
        this.emit('config.missing', { name: key, description: fields[key] });
      } else {
        this.config(`env.${key}`, process.env[key]);
      }
    });
}
