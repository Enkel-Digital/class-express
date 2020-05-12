/**
 * Simple module that exports a single function that generates randomAlphaNumerics
 * Not designed to be secure, used for hash maps and tmp unique IDs
 */

/**
 * @function randomAlphaNumeric
 * @returns A 11 character alpha numeric string
 *
 * This is NOT cryptographically secure
 */
export default () =>
  Math.random()
    .toString(36)
    .substring(2);
