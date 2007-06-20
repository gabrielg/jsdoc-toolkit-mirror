/** 
 * Twiddle the given flick. 
 * @name twiddle.flick
 * @function
 * @param {flick} f
 */
function zipZap(zID) { // <-- NOTICE: this is NOT the named object cited above!
}

/** 
 * Join two str together. 
 * @name Concat
 * @constructor
 * @param {String} strX The first string.
 * @param {String} strY The other string.
 */
Builder.make({construct: "Concat", params: ['strX', 'strY']}); // <-- this won't be recognized.

/** 
 * Join two str together with a separator string. 
 * @name join
 * @function
 * @memberOf Concat
 * @param {String} separator.
 */