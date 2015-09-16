/**
 * config/file.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Path        from 'path';
import Debug       from 'debug';
import Chalk       from 'chalk';
import AppRoot     from 'app-root-path';

const  debug = Debug('ignis:config:file');

/*!
 * Patch require() to handle YAML files.
 */
require('require-yaml');


/**
 * file(1)
 *
 * @description                Loads the given file into Ignis configuration.
 *                             All files are loaded from the parent context.
 *                             Supports json and yaml files.
 * @param          {path}      Path to the config file, relative to the parent
 *                             module root path.
 */
export default function file(path) {
  const abs = Path.resolve(AppRoot.path, path);
  debug(Chalk.dim(abs));
  const cfg = require(abs);

  /* Setup configuration */
  const name = Path.basename(path, Path.extname(path));
  this.config(name, cfg);
}
