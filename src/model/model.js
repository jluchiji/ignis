/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import Bluebird    from 'bluebird';
import { store }   from '../symbols';

const  debug     = Debug('ignis:model');

/**
 * model(2)
 *
 * @description                Adds a new model to the ignis.js
 * @param          {name}      Name of the model.
 * @param          {callback}  Callback that returns a model object.
 */
export default function model(name, callback) {
  let store = model[store];

  if (store[name]) {
    throw new Error(`Cannot overwrite an existing model: ${name}`);
  }

  Bluebird
    .resolve(callback())
    .then(function() {

    });
}

/*!
 * Map for storing models.
 */
model[store] = new Map();
