// cards.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { fisherYatesShuffle } from './fisher-yates-shuffle.mjs';

/** Specifies a crazy eight rank. */
export const eight = '8';

/** Specifies the set of valid ranks. */
export const ranks = [
    '2', '3', '4', '5', '6', '7', eight, '9', '10', 'J', 'K', 'Q', 'A'
];

/** Specifies the set of valid suits. */
export const suits = ['♠️', '❤️', '♣️', '♦️'];

/**
 * Creates an Array of numbers within the discrete interval [`min`, `max`) such
 * that its values are monotonically increasing. The difference between a value
 * and the one that precedes it (the `step` size) is constant.
 * 
 * @param  {...any} args One argument, specifying `max`; two arguments
                         specifying `min` and `max`; or three arguments,
                         specifying `min`, `max`, and `step`. The default value
                         of `min` is `0`. The default value of `step` is `1`.
 * @returns {Array} A `min`-`max` range incrementing by `step`.
 */
export function range(...args) {
    let min = 0;
    let max;
    let step = 1;

    switch (args.length) {
        case 1:
            [max] = args;
            break;

        case 2:
            [min, max] = args;
            break;

        case 3:
            [min, max, step] = args;
            break;
    }

    const result = [];

    for (let i = min; i < max; i += step) {
        result.push(i);
    }

    return result;
}

/**
 * Generates a 52-card deck.
 * 
 * @returns {Array} An `Array` consisting of 52 card objects.
 */
export function generateDeck() {
    let count = 0;
    const result = new Array(52);

    for (const suit of suits) {
        for (const rank of ranks) {
            result[count] = {
                suit: suit,
                rank: rank
            };
            count++;
        }
    }

    return result;
}

/**
 * Shuffles the deck.
 * 
 * @param {Array} deck an `Array` of card objects.
 * @returns {Array} A new `Array` consisting of all cards from the `deck`,
 *                  shuffled.
 */
export function shuffle(deck) {
    const result = [...deck];

    fisherYatesShuffle(result);

    return result;
}

/**
 * Removes `n` cards from the deck and returns both the new deck and cards
 * removed.
 * 
 * @param {Array}  cardsArray an `Array` of card objects.
 * @param {Number} n          the number of cards to draw. The default is `1`.
 * @returns {Array} An `Array` consisting of two elements: a new `Array`
 *          consisting of the cards in cardArray with the last `n` elements
 *          removed, and a new `Array` consisting of the removed elements.
 */
export function draw(cardsArray, n = 1) {
    return [
        cardsArray.slice(0, cardsArray.length - n),
        cardsArray.slice(cardsArray.length - n)
    ];
}

/**
 * Deals `cardsPerHand` cards into `numHands` separate card arrays.
 * 
 * @param {Array}  cardsArray   an `Array` of card objects.
 * @param {Number} numHands     the number of hands of cards to create. The
 *                              default is `2`.
 * @param {Number} cardsPerHand the number of cards per hand. The default is
 *                              `5`.
 * @returns {*} An object consisting of two `Array` properties: `deck`: a new 
 *              `Array` consisting of the cards in `cardArray` with the last
 *              `numHands` times `numcardsPerHand` cards removed; `hands`: a new
 *              `Array` consisting of `numHands` subarrays of card objects.
 */
export function deal(cardsArray, numHands = 2, cardsPerHand = 5) {
    let drawn;
    const result = { hands: Array(numHands) };

    [result.deck, drawn] = draw(shuffle(cardsArray), numHands * cardsPerHand);

    for (let i = 0; i < numHands; i++) {
        result.hands[i] = Array(cardsPerHand);

        for (let j = 0; j < cardsPerHand; j++) {
            result.hands[i][j] = drawn[i * cardsPerHand + j];
        }
    }

    return result;
}

/**
 * Produces a string representation of a given card.
 * 
 * @param {*} card a card object.
 * @returns {String} A `String` representing the `card`.
 */
export function cardToString(card) {
    if (!card) {
        return "None";
    }

    return card.rank + card.suit;
}

/**
 * Produces a string representation of a given hand.
 * 
 * @param {Array}   hand    an `Array` of card objects.
 * @param {String}  sep     the `String` to place between cards. The default is
 *                          `"  "`.
 * @param {Boolean} numbers a `Boolean` specifying whether or not to include the
 *                          position of the card in the `Array` starting at index
 *                          `1`. The default is `false`.
 * @returns {String} A `String` representing the `Array` of card objects.
 */
export function handToString(hand, sep = "  ", numbers = false) {
    const cardStrings = Array(hand.length);

    if (numbers) {
        for (let i = 0; i < hand.length; i++) {
            cardStrings[i] = (i + 1) + ": " + cardToString(hand[i]);
        }
    } else {
        for (let i = 0; i < hand.length; i++) {
            cardStrings[i] = cardToString(hand[i]);
        }
    }

    return cardStrings.join(sep);
}

/**
 * Determines if two objects share at least one equal key-value pair.
 * 
 * @param {*} obj      an object to compare to `matchObj`.
 * @param {*} matchObj an object to compare to `obj`.
 * @returns {Boolean} `true` if `obj` contains any of the keys and values in
 *                    `matchObj`; otherwise, `false`.
 */
export function matchesAnyProperty(obj, matchObj) {
    for (const key in obj) {
        if (matchObj[key] === obj[key]) {
            return true;
        }
    }

    return false;
}

/**
 * Finds a card matching the rank or suit of the `matchObj` or an eight-ranked
 * card, starting from the end of the `deck` and going backwards.
 * 
 * @param {Array} deck     the deck.
 * @param {*}     matchObj the card to match.
 * @returns An Array consisting of two elements: a new `Array` consisting of the
 *          cards in the `deck` with some number of elements removed from the
 *          end; a new `Array` consisting of the removed elements.
 */
export function drawUntilPlayable(deck, matchObj) {
    for (let i = deck.length - 1; i >= 0; i--) {
        if (deck[i].rank === eight || matchesAnyProperty(deck[i], matchObj)) {
            return [deck.slice(0, i), deck.slice(i).reverse()];
        }
    }

    return [[], deck];
}
