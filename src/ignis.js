/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import FS           from 'fs';
import YAML         from 'yamljs';

import DataSource   from './data/source';
import DataModel    from './data/model';


/*!
 * Patch require() to handle .yml/.yaml files.
 */
require.extensions['.yml'] = function(module, filename) {
  return YAML.parse(FS.readFileSync(filename, 'utf8'));
};
require.extensions['.yaml'] = require.extensions['.yml'];


/*!
 * Export the root Ignis.js object.
 */
export default {
  data:   DataSource,
  model:  DataModel
};
