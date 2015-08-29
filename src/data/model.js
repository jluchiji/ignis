/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Bluebird    from 'bluebird';
import Symbol      from '../util/symbols';

/*!
 * Debug logger.
 */
const  debug     = Debug('ignis:model');


/*!
 * Export symbols used by model(2)
 */
export const __models = Symbol('Ignis::data::models');


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
  let store = this[__models];

  /* Get the model with the specified name if callback is not specified. */
  if (typeof callback !== 'function') {
    let result = store.get(name);
    if (!result) { throw new Error(`Model not found: ${name}`); }
    return result;
  }

  /* Otherwise, create a new model. */
  this.wait(function() {
    let src = this.source(source);
    if (store.get(name)) { throw new Error(`Model already exists: ${name}`); }

    debug(`Ignis::model(): Creating ${name}`);
    let that   = Object.create(null);

    return Bluebird
      .resolve(callback.call(that, src))
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
