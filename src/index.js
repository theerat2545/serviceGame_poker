// index.js
import * as PIXI from 'pixi.js';
import { createButton } from './button';
import { compareCards } from './compareCards';
import cardData from '../dist/poker_card/poker_card.json';

const app = new PIXI.Application({
    backgroundColor: 0x1099bb,
    width: 600,
    height: 480,
});
document.body.appendChild(app.view);

const texture = PIXI.Texture.from(cardData.meta.image);
const cardSprites = [];

for (const key in cardData.frames) {
    const frameData = cardData.frames[key].frame;
    const rect = new PIXI.Rectangle(frameData.x, frameData.y, frameData.w, frameData.h);

    const cardTexture = new PIXI.Texture(texture.baseTexture, rect);
    const cardSprite = new PIXI.Sprite(cardTexture);

    cardSprite.x = Math.random() * app.renderer.width;
    cardSprite.y = Math.random() * app.renderer.height;

    app.stage.addChild(cardSprite);
    cardSprites.push(cardSprite);
}

async function onButtonClick(button) {
    try {
        button.visible = false; 
        const data = await fetchCardData();
        if (data) {
            const result = compareCards(data);
            console.log('Comparison Result:', result);
            displayResult(result);
            await moveCardsFor5Seconds();
            showCardsAccordingToIds(data);
            restartButton.visible = true; 
            return result;
        }
    } catch (error) {
        console.error('Error during button click:', error);
    }
}

async function onRestartClick() {
    restartButton.visible = false; 
    setData(textRed, textBlue, textWinLabel, textWinResult);
    const data = await fetchCardData();
    if (data) {
        const result = compareCards(data);
        console.log('Comparison Result:', result);
        displayResult(result);
        await moveCardsFor5Seconds();
        showCardsAccordingToIds(data);
        restartButton.visible = true; 
        return result;
    }
    
}



function displayResult(result) {
    console.log('Result:', result);
}

function moveCardsFor5Seconds() {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 5000;

        const tickerCallback = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed < duration) {
                cardSprites.forEach(sprite => {
                    sprite.x += 1;
                    sprite.y += 1;

                    if (sprite.x > app.renderer.width) sprite.x = 0;
                    if (sprite.y > app.renderer.height) sprite.y = 0;
                });
            } else {
                cardSprites.forEach(sprite => {
                    sprite.visible = false;
                });

                app.ticker.remove(tickerCallback);
                resolve();
            }
        };

        app.ticker.add(tickerCallback);
    });
}

function showCardsAccordingToIds(data) {
    const [redCard, blueCard] = data;
    const newCardSprites = [];
    const ids = [redCard.id, blueCard.id];

    ids.forEach((id, index) => {
        if (cardData.frames[`poker${id}.png`]) {
            const frame = cardData.frames[`poker${id}.png`].frame;
            const rect = new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h);
            const cardTexture = new PIXI.Texture(texture.baseTexture, rect);
            const cardSprite = new PIXI.Sprite(cardTexture);

            cardSprite.x = index * 250 + 130;
            cardSprite.y = app.renderer.height / 2 - 100;

            app.stage.addChild(cardSprite);
            newCardSprites.push(cardSprite);
        } else {
            console.error(`Card data for ID ${id} is missing.`);
        }
    });
}

async function fetchCardData() {
    try {
        const response = await fetch('http://localhost:3000/api/draw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exampleData: 'data' }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

function setData(textRed, textBlue, textWinLabel, textWinResult) {
    console.log("Restarting the game...");


    // รีเซ็ตการ์ดทั้งหมดให้เป็นสถานะเริ่มต้น
    cardSprites.forEach(sprite => {
        sprite.visible = true;
        sprite.x = Math.random() * app.renderer.width;
        sprite.y = Math.random() * app.renderer.height;
    });

    // ตรวจสอบว่าตัวแปรเหล่านี้ไม่เป็น undefined ก่อนตั้งค่า
    if (textRed && textBlue && textWinLabel && textWinResult) {
        textRed.visible = false;
        textBlue.visible = false;
        textWinLabel.visible = false;
        textWinResult.text = ''; // เคลียร์ข้อความ WIN result
    } else {
        console.error('Some text variables are undefined');
    }
}




const { button, restartButton, textRed, textBlue, textWinLabel, textWinResult } = createButton(app, onButtonClick, onRestartClick);

// และใน onRestartClick
// onRestartClick(textRed, textBlue, textWinLabel, textWinResult);s

