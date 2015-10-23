/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import Chalk       from 'chalk';
import Bluebird    from 'bluebird';
import { symbol }  from 'ignis-util';

/*!
 * Debug logger.
 */
const  debug     = Debug('ignis:data:model');


/*!
 * Export symbols used by model(2)
 */
export const __models = symbol('Ignis::data::models');


/**
 * model(2)
 *
 * @description                Gets/sets a model of the ignis.js
 * @param          {name}      Name of the model.
 * @param          {source}    (optional) Name of the data source.
 * @param          {callback}  (optional) Callback that returns a model object.
 * @returns        {model}     Resulting model object.
 */
export function model(name, source, callback) {
  const store = this[__models];

  /* Get the model with the specified name if callback is not specified. */
  if (!callback) {
    const result = store.get(name);
    if (!result) { throw new Error(`Model not found: ${name}`); }
    return result;
  }

  if (callback.__esModule) { callback = callback.default; }

  /* Otherwise, create a new model. */
  this.wait(function() {
    const src = source && this.source(source);
    if (store.get(name)) { throw new Error(`Model already exists: ${name}`); }

    debug(`${Chalk.cyan('[success]')} ${name}`);
    const that   = Object.create(null);

    return Bluebird
      .try(() => callback.call(that, this, src))
      .then(result => {
        result = result || that;

        /* Allow models to emit events */
        result.emit = (event, args) => {
          this.emit(`model.${name}.${event}`, args);
        };

        /* Save the model for later use. */
        store.set(name, result);
      });
  });

  return this;
}
