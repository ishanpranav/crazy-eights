// cards.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

const suits = ['♠️', '❤️', '♣️', '♦️'];
const ranks = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'K', 'Q', 'A'
];

export function range(...args) {
    let min = 0;
    let max;
    let step = 1;

    switch (args.length) {
        case 1: [max] = args; break;

        case 2:
            [min, max] = args;
            break;

        case 3:
            [min, max, step] = args;
            break;
    }

    const result = new Array();

    for (let i = min; i < max; i += step) {
        result.push(i);
    }

    return result;
}

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
