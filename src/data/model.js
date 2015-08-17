/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Bluebird    from 'bluebird';
import DataSource  from './source';

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
export default function model(name, source, callback) {

  /* Get the model with the specified name if callback is not specified. */
  if (typeof callback !== 'function') {
    let result = store.get(name);
    if (!result) { throw new Error(`Model not found: ${name}`); }
    return result;
  }

  /* Otherwise, create a new model. */
  let src = DataSource(source);
  if (store[name]) { throw new Error(`Model already exists: ${name}`); }
  store.set(name, callback(src));
}


/**
 * model.clear(0)
 *
 * @description                Deletes all stored models.
 */
model.clear = function() { store.clear(); };
