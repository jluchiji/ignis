/**
 * core.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Chalk       from 'chalk';
import Toposort    from 'toposort';


import Service     from './service';
import ServiceName from './util/service-name';

const debug = Debug('ignis:core');


/* Symbol to hide services */
const $$base = Symbol();
const $$services = Symbol();


/*
 * Ignis class.
 * The service manager.
 */
export default class Ignis {

  constructor() {
    this[$$services] = new Map();
    this.startup = null;
  }


  /**
   * Uses an extension module.
   */
  use(service) {

    /* Handle ES6 modules */
    if (service.__esModule) { service = service.default; }

    /* If this is a Service, register it */
    if (service.prototype instanceof Service) {
      debug(Chalk.bold.cyan('register') + ` ${service.name}`);
      Ignis[$$services].add(service);
      return;
    }

    /* If this is an old-style callback,invoke it */
    if (typeof service === 'function') {
      debug(Chalk.bold.cyan('invoke') + ` ${service.name || '<anonymous>'}`);
      service(this);
      return;
    }

    throw new Error('Unexpected service type.');
  }


  /**
   * Finds a service.
   */
  service(name) {
    const service = this[$$services].get(name);

    /* Fail if there is no such service */
    if (!service) {
      throw new Error(`Service [${name}] is not defined.`);
    }

    /* Fail if service is not ready */
    if (!service.ready) {
      throw new Error(`Service [${name}] is not ready.`);
    }

    return service;
  }


  /**
   * Finds a data source.
   */
  model(name) {
    return this.service(`data:${name}`);
  }

  /**
   * Initializes all registered services.
   */
  async init() {

    /* Prepare to toposort */
    const graph = [ ];

    /* Instantiate and toposort services */
    for (const service of Ignis[$$services]) {

      /* Normalize service name */
      const name = ServiceName(service);
      debug(Chalk.bold.cyan('create') + ` ${name}`);

      /* Instantiate and save service reference */
      const svc = new service(this);
      svc[$$base] = service;

      this[$$services].set(name, svc);

      /* Push dependency info into toposort */
      const deps = Service.meta(service, 'deps') || [ ];
      for (const dep of deps) { graph.push([ dep, name ]); }
      if (deps.length === 0) { graph.push([ name ]); }
    }
    const sorted = _.compact(Toposort(graph));
    debug(sorted);

    /* Initialize services */
    for (const name of sorted) {
      debug(Chalk.bold.yellow('init') + ` ${name}`);
      const service = this[$$services].get(name);

      /* Extract dependencies */
      let deps = Service.meta(service[$$base], 'deps') || [ ];
      deps = deps.map(i => this.service(i));

      /* Invoke initialization callback */
      await service.init(...deps);
      service.ready = true;
    }

  }


}


/**
 * Registered services
 */
Ignis[$$services] = new Set();


/**
 * Expose symbols
 */
Ignis.$$base = $$base;
Ignis.$$services = $$services;
