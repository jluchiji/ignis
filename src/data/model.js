/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Bluebird    from 'bluebird';
import { namespace }         from '../util/symbols';
import { source as Source }  from './source';

/*!
 * Debug logger.
 */
const  debug     = Debug('ignis:model');

/*!
 * Map for storing model objects.
 */
var    store     = new Map();


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

  /* Get the model with the specified name if callback is not specified. */
  if (typeof callback !== 'function') {
    let result = store.get(name);
    if (!result) { throw new Error(`Model not found: ${name}`); }
    return result;
  }

  /* Otherwise, create a new model. */
  let src = Source(source);
  if (store.get(name)) { throw new Error(`Model already exists: ${name}`); }

  /* Setup internal wiring for models when called on a namespace. */
  let that   = Object.create(null);
  let result = callback.call(that, src);
  result = result || that;
  if (this && typeof this.emit === 'function') {
    result[namespace] = this;
    result.emit = function(event, args) {
      result[namespace].emit(`model.${name}.${event}`, args);
    };
  }

  /* Save the model for later use. */
  store.set(name, result);
}


/**
 * model.clear(0)
 *
 * @description                Deletes all stored models.
 */
model.clear = function() { store.clear(); };


/*!
 * Extension
 */
export default function dataModel(ignis) {
  ignis.model = model;
}
