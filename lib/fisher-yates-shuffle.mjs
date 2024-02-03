// fisher-yates-shuffle.mjs
// Licensed under the MIT License.

/**
 * Shuffles an array in-place.
 * 
 * See https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle.
 * 
 * @param {Array} a the array to shuffle
 */
export function fisherYatesShuffle(a) {
    const n = a.length;

    // LET a be an n-element array with indices 0...n - 1

    for (let i = 0; i < n - 1; i++) { // FOR i FROM 0 TO n - 2 DO
        // j := random, where i <= j < n 

        const j = Math.floor(Math.random() * (n - i)) + i;

        // swap a[i], a[j]
        
        [a[i], a[j]] = [a[j], a[i]];
    }
}
