// index.js
import * as PIXI from 'pixi.js';
import { ButtonText } from './buttonAndText';
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

// function click start
async function onButtonClick(button) {
    try {
        button.visible = false; 
        const data = await fetchCardData();
        if (data) {
            const result = compareCards(data);
            // console.log('Comparison Result:', result);
            displayResult(result);
            await moveCardsFor5Seconds();
            showCardsAccordingToIds(data);

            if (result.WIN) {
                textWinResult.style.fill = result.WIN === 'RED' ? '#FF0000' :
                                           result.WIN === 'BLUE' ? '#0000FF' :
                                           '#006400';
                textWinResult.text = result.WIN;
            }

            textRed.visible = true;
            textBlue.visible = true;
            textWinLabel.visible = true;
            textWinResult.visible = true;
            restartButton.visible = true; 
            return result;
        }
    } catch (error) {
        console.error('Error during button click:', error);
    }
}

// function click restart
async function onRestartClick() {
    restartButton.visible = false;
    setData(textRed, textBlue, textWinLabel, textWinResult);

    try {
        const data = await fetchCardData();
        if (data) {
            const result = compareCards(data);
            // console.log('Comparison Result:', result);
            displayResult(result);
            await moveCardsFor5Seconds();
            showCardsAccordingToIds(data);

            // ตรวจสอบค่าของข้อความและแสดงข้อความ
            if (result.WIN) {
                textWinResult.style.fill = result.WIN === 'RED' ? '#FF0000' :
                                           result.WIN === 'BLUE' ? '#0000FF' :
                                           '#006400';
                textWinResult.text = result.WIN;
            }
            textRed.visible = true;
            textBlue.visible = true;
            textWinLabel.visible = true;
            textWinResult.visible = true;

            restartButton.visible = true; 
            return result;
        }
    } catch (error) {
        console.error('Error during restart button click:', error);
    }
}

// function log result
function displayResult(result) {
    console.log('Result:', result);
}

// function animation move poker
function moveCardsFor5Seconds() {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 3000;

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

// function show card RED and BLUE
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

    // Track the displayed cards to hide them during restart
    displayedCardSprites = newCardSprites;
}

//  function http request method(POST)
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
        // console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

let displayedCardSprites = []; // To track the two displayed cards

//  function set data restart
function setData(textRed, textBlue, textWinLabel, textWinResult) {
    console.log("Restarting the game...");

    // ซ่อนและจัดตำแหน่งใหม่ให้กับไพ่ทั้งหมด
    cardSprites.forEach(sprite => {
        sprite.visible = true;
        sprite.x = Math.random() * app.renderer.width;
        sprite.y = Math.random() * app.renderer.height;
    });

    // ซ่อนไพ่สองใบที่แสดงก่อนหน้านี้
    displayedCardSprites.forEach(sprite => {
        sprite.visible = false;
    });
    displayedCardSprites = []; // ล้างค่า array หลังจากซ่อนไพ่แล้ว

    // ซ่อนผลลัพธ์และเคลียร์ข้อความ WIN
    if (textRed && textBlue && textWinLabel && textWinResult) {
        textRed.visible = false;
        textBlue.visible = false;
        textWinLabel.visible = false;
        textWinResult.text = ''; // เคลียร์ข้อความ WIN result
        textWinResult.visible = false;
    } else {
        console.error('Some text variables are undefined');
    }
}
const { button, restartButton, textRed, textBlue, textWinLabel, textWinResult } = ButtonText(app, onButtonClick, onRestartClick);


