import
{
    startButtonElement, resetButtonElement, aboutButtonElement, helpButtonElement,
    scoreTableButtonElement, paperElement, rockElement, scissorsElement
} from "./html-elements.js";
import defineButtonBehavior from "./button-tasks.js";
import defineGameElementsBehavior from "./gameplay-and-effects.js";
import { startTimeCounter, stopTimeCounter } from "./time-counter.js";
import { keyboardClick } from "./mouse-and-keyboard-handlers.js";
import { setAndGamePopupMessage } from "./messages-tweaker.js";

const BUTTON_ACTIVE = "button-clicked";
const CHOICE_ACTIVE = "gameplay-element-clicked";
const CLOSINGX_ACTIVE = "closingX-clicked";

const gameStats = (() =>
    ({
        setCounter: 0,
        playerScore: 0,
        computerScore: 0,
        setsWon: { player: 0, computer: 0},
        SET_DURATION: 30,
        setTimer: 0,
        timeIsRunning: false,
        movesPlayed: 0
    }))();

const options = (() =>
    ({
        startTitle: { text: "" },
        timer: { ID: "", callCount: 0 },
        statusMessage: { scoreMessage: "", helpMessage: "" },
        endOfSetPopupMessage:
        {
            styleTimeout: { ID: "", duration: 5000 },
            inputTimeout: { ID: "", duration: 5500 },
            messageObject: "",
            initialTimepoint: 0,
            active: false
        },
        popupDialog:
        {
            active: false,
            currentDialogID: "",
            resultTable:
            {
                name: "table",
                clickAmmount: 0,
                ID: "result-table-wrapper"
            },
            helpDialog:
            {
                name: "help",
                clickAmmount: 0,
                ID: "help-dialog-wrapper"
            },
            aboutDialog:
            {
                name: "about",
                clickAmmount: 0,
                ID: "about-dialog-wrapper"
            }
        },
        clickSource:
        {
            buttons:
            {
                name: "buttons",
                types: ["command-button", "info-button"],
                styling: BUTTON_ACTIVE,
            },
            gameplay:
            {
                name: "gameplay",
                styling: CHOICE_ACTIVE
            },
            popup:
            {
                name: "popup",
                styling: CLOSINGX_ACTIVE
            },
            eventCalled: 0,
            clickCount: 0,
            clickTimeout: 100
        }
    }))();

const keyboardEntries = (() =>
    ({
        buttons:
        {
            Enter: startButtonElement,
            Backspace: resetButtonElement,
            KeyH: { target: helpButtonElement, activates: "help-dialog-wrapper" },
            KeyT: { target: scoreTableButtonElement, activates: "result-table-wrapper" },
            KeyA: { target: aboutButtonElement, activates: "about-dialog-wrapper" },
            clickClass: BUTTON_ACTIVE
        },
        gameplay:
        {
            KeyR: rockElement,
            KeyP: paperElement,
            KeyS: scissorsElement,
            clickClass: CHOICE_ACTIVE
        },
        popup:
        {
            Escape: "",
            clickClass: CLOSINGX_ACTIVE
        },
        clickCounter: 0
    
    }))();

keyboardClick(keyboardEntries, options);
defineButtonBehavior(gameStats, options);
defineGameElementsBehavior(gameStats, options);

document.addEventListener('visibilitychange', () =>
{
    const timeCounter = gameStats.setTimer;
    let popupDialogActive = options.popupDialog.active;
    let timeIsRunning = gameStats.timeIsRunning;
    let startTitleText = options.startTitle.text;
    
    const endOfSetMessage = options.endOfSetPopupMessage;
    const messageStyleTimeout = endOfSetMessage.styleTimeout;
    const messageInputTimeout = endOfSetMessage.inputTimeout;
    
    if(document.hidden) 
    {
        if(timeIsRunning && !popupDialogActive)
        {
            if(startTitleText !== "PAUSE")
            {
                stopTimeCounter(gameStats, timeCounter, options);
            }
        }

        if(endOfSetMessage.active)
        {
            clearTimeout(messageStyleTimeout.ID);
            clearTimeout(messageInputTimeout.ID);

            let timePassed = Date.now() - endOfSetMessage.initialTimepoint;
            messageStyleTimeout.duration -= timePassed;
            messageInputTimeout.duration -= timePassed;
        }
    }
    else 
    {
        if(gameStats.setTimer !== 0 && !timeIsRunning && !popupDialogActive)
        {
            if(startTitleText !== "PAUSE")
            {
                options.timer.ID = startTimeCounter(gameStats, options);
            }
        }

        if(endOfSetMessage.active)
        {
            setAndGamePopupMessage(gameStats, options);
        }
    }
});

export { gameStats }

// function justATest()
// {
//     const testArray = JSON.parse(JSON.stringify(jsonDummy));

//     console.log(testArray[0]);
// }

// justATest();

// async function checkingTextLoad()
// {
//     const fetcher = await fetch("../texts/help.txt");
//     const text = await fetcher.text();
//     return text;
// }

// checkingTextLoad().then(createFictList);

// function createFictList(text)
// {
//     const textArr = text.split("- ");
//     console.log(textArr);

//     const someDiv = document.getElementById("something");
//     const unorderedList = document.createElement("ul"); 
//     someDiv.appendChild(unorderedList);

//     for(let i = 1; i < textArr.length; i++)
//     {
//         const listElement = document.createElement("li");
//         listElement.innerText = textArr[i];
//         unorderedList.appendChild(listElement);
//     }
// }


