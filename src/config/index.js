/**
 * config/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


/*!
 * Map to store configuration options
 */
const store = new Map();


/**
 * config(2)
 *
 * @description                Sets the configuration value if one is provided;
 *                             Otherwise returns the configuration value.
 * @param          {name}      Name of the configuration to get/set.
 * @param          {value}     [Optional] Value of the configuration to set.
 * @returns                    {this} for set; config value for get.
 */
export function config(name, value) {
  let old = store.get(name);

  /* Get config value if available */
  if (typeof value === 'undefined') {
    /* Always check that config exists */
    if (typeof old === 'undefined') {
      throw new Error(`Config option '${name}' is not defined.`);
    }
    return old;
  }

  /* Otherwise, set the config value */
  store.set(name, value);
  this.emit(
    (typeof old === 'undefined') ? 'config.set' : 'config.modified',
    {
      name:     name,
      oldValue: old,
      newValue: value
    }
  );
  return this;
}


/**
 * config.clear()
 *
 * @description                Deletes all configuration values.
 */
config.clear = function() {
  store.clear();
};


/*!
 * Ignis.js extension
 */
export default function(ignis) {
  ignis.config = config;
}
