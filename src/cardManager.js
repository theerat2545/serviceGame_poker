import * as PIXI from 'pixi.js';

const cardTextures = {};

export function createCardTextures(resources) {
    for (let i = 1; i <= 52; i++) {
        // Assume 'poker1', 'poker2', ..., 'poker52' are the names of the textures in the spritesheet
        cardTextures[i] = resources.poker_card.textures[`poker${i}.png`];
    }
}

export function setupCardSprites(app, data, resources) {
    const { RED, BLUE } = data;

    const redCardTexture = cardTextures[RED.id];
    const blueCardTexture = cardTextures[BLUE.id];

    if (redCardTexture && blueCardTexture) {
        const redCardSprite = new PIXI.Sprite(redCardTexture);
        const blueCardSprite = new PIXI.Sprite(blueCardTexture);

        redCardSprite.x = 100;
        redCardSprite.y = 200;
        blueCardSprite.x = 400;
        blueCardSprite.y = 200;

        app.stage.addChild(redCardSprite);
        app.stage.addChild(blueCardSprite);
    } else {
        console.error('Card textures not found for IDs:', RED.id, BLUE.id);
    }
}