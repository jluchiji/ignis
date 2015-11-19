/**
 * services/endpoint.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Ignis       from '../core';
import Service     from '../service';


/**
 * Symbol to hide individual endpoint method options.
 */
const $$options = Symbol();


/**
 * Base class for HTTP endpoints as an Ignis.Service.
 */
export default class EndpointService extends Service {

  constructor(ignis) {
    super(ignis);
  }

  async init() {
    /* Every endpoint depends on HTTP, so fail if not it's ready */
    this.http = this.ignis.service('http');
  }

  postinit() {
    const defaults = Service.meta(this[Ignis.$$base], 'endpoint_options');
    const options = this[$$options];

    const root = defaults && defaults.path;
    if (!root) {
      throw new Error('EndpointService must have a mount path.');
    }

    for (const prop of Object.keys(options)) {
      if (!options[prop].path) {
        throw new Error(`Endpoint method [${prop}] must have a mount path`);
      }
      const payload = _.assign({ }, defaults, options[prop]);
      payload.handler = this[prop].bind(this);
      this.http.mount(root, payload);
    }
  }


  /**
   * @description (decorator) Specifies the endpoint option.
   */
  static option(key, value) {
    return function(target, name) {

      if (target.prototype instanceof EndpointService) {
        const container = Service.meta(target, 'endpoint_options') || { };
        container[key] = value;
        Service.meta(target, 'endpoint_options', container);
      } else {
        const container = target[$$options] || { };
        _.set(container, `${name}.${key}`, value);
        target[$$options] = container;
      }
    };
  }


  /**
   * @description (decorator) Specifies the mount path of the Endpoint.
   */
  static path(path, status = 200) {
    return function(target, name, descriptor) {
      EndpointService.option('path', path)(target, name, descriptor);
      EndpointService.option('status', status)(target, name, descriptor);
    };
  }


}


/**
 * Expose symbols
 */
EndpointService.$$options = $$options;
