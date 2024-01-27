// cards.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { fisherYatesShuffle } from './fisher-yates-shuffle.mjs';

const suits = ['♠️', '❤️', '♣️', '♦️'];
const crazy = '8';
const ranks = [
    '2', '3', '4', '5', '6', '7', crazy, '9', '10', 'J', 'K', 'Q', 'A'
];

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

    const result = Array();

    for (let i = min; i < max; i += step) {
        result.push(i);
    }

    return result;
}

export function generateDeck() {
    let count = 0;
    const result = Array(52);

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

export function shuffle(deck) {
    const result = [...deck];

    fisherYatesShuffle(result);

    return result;
}

export function draw(cardsArray, n = 1) {
    return [
        cardsArray.slice(0, cardsArray.length - n),
        cardsArray.slice(cardsArray.length - n)
    ];
}

export function deal(cardsArray, numHands = 2, cardsPerHand = 5) {
    let drawn;
    const cards = numHands * cardsPerHand;
    const result = { hands: Array(numHands) };

    [result.deck, drawn] = draw(shuffle(cardsArray), cards);

    for (let i = 0; i < numHands; i++) {
        result.hands[i] = Array(cardsPerHand);

        for (let j = 0; j < cardsPerHand; j++) {
            result.hands[i][j] = drawn[i * cardsPerHand + j];
        }
    }

    return result;
}

export function handToString(hand, sep = "  ", numbers = false) {
    const cardStrings = Array(hand.length);

    if (numbers) {
        for (let i = 0; i < hand.length; i++) {
            cardStrings[i] = (i + 1) + ": " + hand[i].rank + hand[i].suit;
        }
    } else {
        for (let i = 0; i < hand.length; i++) {
            cardStrings[i] = hand[i].rank + hand[i].suit;
        }
    }

    return cardStrings.join(sep);
}

export function matchesAnyProperty(obj, matchObj) {
    for (const key in obj) {
        if (matchObj[key] === obj[key]) {
            return true;
        }
    }

    return false;
}

export function drawUntilPlayable(deck, matchObj) {
    for (let i = deck.length - 1; i >= 0; i--) {
        if (deck[i].rank === crazy || matchesAnyProperty(deck[i], matchObj)) {
            return [deck.slice(0, i), deck.slice(i).reverse()];
        }
    }

    return [[], deck];
}
