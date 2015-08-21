/**
 * error.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';

/**
 * IgnisError
 *
 * @description    Error arising within Ignis.js that should be reported back
 *                 to the client via an HTTP response.
 */
export class IgnisError extends Error {

  constructor(status, message, details) {
    super(message);

    this.name    = 'IgnisError';
    this.status  = status;
    this.message = message;
    this.details = details;

    if (details && details.sensitive) { this.sensitive = true; }
  }


  /**
   * .panic(3)
   *
   * @static
   * @access                   public
   * @description              Throws an IgnisError.
   * @param        {status}    Status code to report to the client.
   * @param        {message}   Human-readable message to report.
   * @param        {details}   Additional error details and options.
   * @throws       {IgnisError}
   */
  static panic(status, message, details) {
    throw new IgnisError(status, message, details);
  }

  /**
   * .deny(2)
   *
   * @static
   * @access                   public
   * @description              Throws an IgnisError with status of 403.
   * @param        {message}   Human-readable message to report.
   * @param        {details}   Additional error details.
   * @throws       {IgnisError}
   */
  static deny(message, details) {
    details = _.assign(details || { }, { sensitive: true });
    throw new IgnisError(403, message, details);
  }

  /**
   * .notFound(2)
   *
   * @static
   * @access                   public
   * @description              Throws an IgnisError with status of 404.
   * @param        {message}   Human-readable message to report.
   * @param        {details}   Additional error details.
   * @throws       {IgnisError}
   */
  static notFound(message, details) {
    throw new IgnisError(404, message, details);
  }

}


/*!
 * Extension
 */
export default function ignisError(ignis) {
  ignis.Error = IgnisError;
}
