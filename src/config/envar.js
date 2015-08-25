/**
 * config/envar.js
 *
 * @author  Denis-Luchkin-Zhou
 * @license MIT
 */


/**
 * env(1)
 *
 * @description                Import specified environment variables into the
 *                             Ignis config.
 * @param          {fields}    Object whose keys are envar names, and values
 *                             are string descriptions of the parameter.
 */
export function env(fields) {
  Object
    .keys(fields)
    .forEach(key => {
      if (typeof process.env[key] === 'undefined') {
        this.emit('config.missing', { name: key, description: fields[key] });
      } else {
        this.config(`env.${key}`, process.env[key]);
      }
    });
}

/*!
 * Ignis.js extension.
 */
export default function envar(ignis) {
  ignis.config.env = env.bind(ignis);
}
