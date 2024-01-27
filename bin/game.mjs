// game.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import clear from 'clear';
import { readFile } from 'fs';
import { question } from 'readline-sync';
import { deal, generateDeck } from '../lib/cards.mjs';
import { fisherYatesShuffle } from '../lib/fisher-yates-shuffle.mjs';

function playCrazyEights(state) {
    console.log(state)
}

let state;

if (process.argv.length > 2) {
    readFile(process.argv[2], (err, data) => {
        if (err) {
            throw err;
        }

        state = JSON.parse(data);

        playCrazyEights(state);
    });
}

playCrazyEights(state);

console.log(12004);
