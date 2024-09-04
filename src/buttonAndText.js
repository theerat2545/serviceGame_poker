import * as PIXI from 'pixi.js';

//  Button And Text
export function ButtonText(app, onButtonClick, onRestartClick) {
    // style button "start "
    const button = new PIXI.Graphics();
    const radius = 20;
    button.beginFill(0xDE3249);
    button.drawRoundedRect(0, 0, 200, 50, radius);
    button.endFill();
    button.x = app.view.width / 2 - button.width / 2;
    button.y = app.view.height / 2 - button.height / 2;
    app.stage.addChild(button);

    // position button
    const buttonText = new PIXI.Text('Random', { fontSize: 24, fill: '#ffffff' });
    buttonText.x = button.width / 2 - buttonText.width / 2;
    buttonText.y = button.height / 2 - buttonText.height / 2;
    button.addChild(buttonText);

    // text "RED"
    const textRed = new PIXI.Text('RED', {
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#FF0000'
    });

    // text "BLUE"
    const textBlue = new PIXI.Text('BLUE', {
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#0000FF'
    });

    // text "WIN"
    const textWinLabel = new PIXI.Text('WIN :', {
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#006400'
    });

    // text WIN: 'Result'
    const textWinResult = new PIXI.Text('', {
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#006400'
    });

    // Positions text
    textRed.x = 130;
    textRed.y = app.renderer.height / 2 - 170;

    textBlue.x = 380;
    textBlue.y = app.renderer.height / 2 - 170;

    textWinLabel.x = 200;
    textWinLabel.y = app.renderer.height / 2 + (app.renderer.height / 2 - 50) / 2;

    textWinResult.x = textWinLabel.x + textWinLabel.width + 10;
    textWinResult.y = textWinLabel.y;

    // add text in state
    app.stage.addChild(textRed);
    app.stage.addChild(textBlue);
    app.stage.addChild(textWinLabel);
    app.stage.addChild(textWinResult);

    // set text visible
    textRed.visible = false;
    textBlue.visible = false;
    textWinLabel.visible = false;
    textWinResult.visible = false;

    // click Event onButtonClick
    button.eventMode = 'dynamic';
    button.buttonMode = true;
    button.on('pointerdown', async () => {
        try {
            const result = await onButtonClick(button);
            if (result) {
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
            }
        } catch (error) {
            console.error('Error during button click:', error);
        }
    });

    // Restart button
    const restartButton = new PIXI.Graphics();
    restartButton.beginFill(0xDE3249);
    restartButton.drawRoundedRect(0, 0, 200, 50, radius);
    restartButton.endFill();
    restartButton.x = app.view.width / 2 - restartButton.width / 2;
    restartButton.y = app.view.height / 2 + 180;

    app.stage.addChild(restartButton);

    const restartButtonText = new PIXI.Text('Retry', { fontSize: 24, fill: '#ffffff' });
    restartButtonText.x = restartButton.width / 2 - restartButtonText.width / 2;
    restartButtonText.y = restartButton.height / 2 - restartButtonText.height / 2;
    restartButton.addChild(restartButtonText);

    restartButton.visible = false; 

    // click event onRestartClick
    restartButton.eventMode = 'dynamic';
    restartButton.buttonMode = true;
    restartButton.on('pointerdown', async () => {
        try {
            const result = await onRestartClick();
            if (result) {
                if (result.WIN) {
                    textWinResult.style.fill = result.WIN === 'RED' ? '#FF0000' :
                                               result.WIN === 'BLUE' ? '#0000FF' :
                                               '#006400';
                    textWinResult.text = result.WIN;
                }
                // set text visible
                textRed.visible = true;
                textBlue.visible = true;
                textWinLabel.visible = true;
                textWinResult.visible = true;
            }
        } catch (error) {
            console.error('Error during restart button click:', error);
        }
    });

    return { button, restartButton, textRed, textBlue, textWinLabel, textWinResult };
}
