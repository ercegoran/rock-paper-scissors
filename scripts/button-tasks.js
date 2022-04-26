import 
{
    contentElement, commandButtonsElement, infoButtonsElement,
    startButtonElement, resetButtonElement, scoreTableButtonElement,
    helpButtonElement, aboutButtonElement, choicePanelElement
} from "./html-elements.js";
import { gameStats } from "./index.js";
import { startTimeCounter, stopTimeCounter } from "./time-counter.js";
import { getPopupDialog, resultTableSetAndStyleUpdate } from "./popup-dialog.js";
import { updateStatusMessage } from "./messages-tweaker.js";
import { mouseAndTouchAction } from "./mouse-and-keyboard-handlers.js";

const START = "START";
const PAUSE = "PAUSE";
const RESUME = "RESUME";

/**
 * Function for attaching "click" event listeners
 * on command buttons, info buttons and button for 
 * displaying result table and also for controlling
 * of a timer.
 * @param {object} score - keeping track of score in each set
 */
export default function defineButtonBehavior(options)
{
    let sourceType = options.clickSource.buttons;
    
    commandButtonsElement.forEach(button =>
    {
        mouseAndTouchAction(button, options, buttonClicked, sourceType);
    });

    infoButtonsElement.forEach(button =>
    {
        mouseAndTouchAction(button, options, buttonClicked, sourceType);
    });
}

const buttonClicked = (e, options, buttonType) =>
{
    const clickedObject = e.target;
    let currentTime = gameStats.setTimer;
    const startButtonTitle = options.startTitle;
    let clickTimeout = options.clickSource.clickTimeout;
    
    if(buttonType === "command-button")
    {
        if(clickedObject === resetButtonElement)
        {
            location.reload();
        }
        else if(clickedObject === startButtonElement)
        {
            setTimeout(() =>
            {
                setStartButtonStyle(startButtonTitle);
                setGameState(currentTime, options);
                updateStatusMessage(startButtonTitle.text, options);
            }, clickTimeout);
        }
    }
    else
    {
        startButtonTitle.text = startButtonElement.innerText;
        options.popupDialog.active = true;
        
        if(gameStats.timeIsRunning)
        {
            stopTimeCounter(currentTime, options);
            updateStatusMessage(PAUSE, options); 
        }

        let popupHide = "hide-popup-dialog";
        let popupHideBelow = "hide-popup-dialog-below";
        let dialogName = clickedObject === scoreTableButtonElement ? "resultTable" :
            clickedObject === helpButtonElement ? "helpDialog" : "aboutDialog";
        const dialogType = options.popupDialog[dialogName];
        
        const popupDialog = getPopupDialogSection(options, dialogType);
        popupDialog.style.left = "50%";
        popupDialog.style.top = "50%";
        const popupDialogClasses = popupDialog.classList;

        if (popupDialogClasses.contains(popupHide))
        {
            popupDialogClasses.remove(popupHide);
        }
        else if (popupDialogClasses.contains(popupHideBelow))
        {
            popupDialogClasses.remove(popupHideBelow);
        }

        setTimeout(() =>
        {
            popupDialog.style.setProperty("--scale", "scale(1)");
            popupDialogClasses.add("show-popup-dialog");
        }, clickTimeout);

        dialogType.clickAmmount++;

        console.log(dialogType.name + " " + dialogType.clickAmmount);
    }
}

/**
 * Function for styling START button
 * according to a game being started, paused or restarted.
 * @param {string} clickSource - checking whether START or PAUSE buttons are being clicked
 */
const setStartButtonStyle = (startButtonTitle) =>
{
    let pauseActive = "start-button-pause-mode";
    startButtonTitle.text = startButtonElement.innerText;
    const startButtonClasses = startButtonElement.classList;
    
    if(startButtonTitle.text === START)
    {
        startButtonElement.innerText = PAUSE;
        startButtonClasses.remove(pauseActive);
    }
    else if(startButtonTitle.text === PAUSE)
    {
        startButtonElement.innerText = RESUME;
        startButtonClasses.add(pauseActive);
    }
    else if(startButtonTitle.text === RESUME)
    {
        startButtonElement.innerText = PAUSE;
        startButtonClasses.remove(pauseActive);
    }
}

const setGameState = (currentTime, options) =>
{
    let nonInteractive = "non-interactive";
    const resetButtonClasses = resetButtonElement.classList;
    const timer = options.timer;
    const startButtonTitle = options.startTitle;
    let startButtonText = startButtonTitle.text;
    
    if(startButtonText === START)
    {
        choicePanelInteractivityChanger(START, nonInteractive);
        
        if(gameStats.setCounter === 0)
        {
            resetButtonClasses.toggle(nonInteractive);
        }
        
        gameStats.setTimer = 30;
        gameStats.setCounter++;
        
        if(gameStats.setCounter > 1)
        {
            gameStats.playerScore = 0;
            gameStats.computerScore = 0;
            gameStats.movesPlayed = 0;
        }

        gameStats["set" + gameStats.setCounter] =
        {
            player: 0,
            computer: 0
        };

        timer.ID = startTimeCounter(options);
    }
    else if(startButtonText === RESUME)
    {
        choicePanelInteractivityChanger(RESUME, nonInteractive);
        timer.ID = startTimeCounter(options);
    }
    else if(startButtonText === PAUSE)
    {
        choicePanelInteractivityChanger(PAUSE, nonInteractive);
        stopTimeCounter(currentTime, options);
    }
}

const choicePanelInteractivityChanger = (startButtonText, nonInteractive) =>
{
    const choicePanelChildren = choicePanelElement.children;

    for(let i = 0; i < choicePanelChildren.length; i++)
    {
        const element = choicePanelChildren[i];
        const elementClasses = element.classList;
        
        if(startButtonText === START || startButtonText === RESUME)
        {
            elementClasses.remove(nonInteractive);
        }
        else
        {
            elementClasses.add(nonInteractive);
        }
    }
}

const getPopupDialogSection = (options, dialogType) =>
{
    const popupDialogSection = contentElement.appendChild(getPopupDialog(dialogType, options));
    
    if (dialogType.name === "table")
    {
        let setCount = gameStats.setCounter;

        if(setCount > 0)
        {
            if(dialogType.clickAmmount === 0)
            {
                for(let i = 1; i < setCount; i++)
                {
                    resultTableSetAndStyleUpdate(gameStats, i);
                }
            }
        
            document.getElementById("player-set-" + setCount).innerText = gameStats.playerScore;
            document.getElementById("computer-set-" + setCount).innerText = gameStats.computerScore;

            document.getElementById("player-set-result").innerText = gameStats.setsWon.player;
            document.getElementById("computer-set-result").innerText = gameStats.setsWon.computer;
        }
    }

    return popupDialogSection;
}

