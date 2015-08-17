/**
 * model/model.js
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
 * @param          {callback}  (optional) Callback that returns a model object.
 * @returns        {model}     Resulting model object.
 */
export default function model(name, callback) {

  /* Get the model with the specified name if callback is not specified. */
  if (typeof callback !== 'function') { return store.get(name); }

  /* Otherwise, create a new model. */
  let source = DataSource.connection();
  if (!source)     { throw new Error('No data connection available.'); }
  if (store[name]) { throw new Error(`Model already exists: ${name}`); }
  store.set(name, callback(source));
}


/**
 * model.clear(0)
 *
 * @description                Deletes all stored models.
 */
model.clear = function() { store.clear(); };
