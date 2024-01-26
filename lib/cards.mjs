// cards.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

export const suits = { SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️' };

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

    const result = Array();

    for (let i = min; i < max; i += step) {
        result.push(i);
    }

    return result;
}
