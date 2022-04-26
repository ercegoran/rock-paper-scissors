import
{
    contentElement, playerScoreElement, computerScoreElement,
    scoreMessageElement, scoreMessageHelpElement
} from "./html-elements.js";
import { gameStats } from "./index.js";
import toggleInteractivity from "./interactivity_tweaker.js";

function updateStatusMessage(status, options)
{
    let currentSet = gameStats.setCounter;
    let numberSuffix = currentSet === 1 ? "st" : currentSet === 2 ? "nd" : currentSet === 3 ? "rd" : "th";
    let description = status === "START" || status === "RESUME" ? "is active" : "is paused";
    let message = `${currentSet}${numberSuffix} set ${description}. . .`;
    const statusMessage = options.statusMessage;

    if (gameStats.movesPlayed > 0)
    {
        if (status === "PAUSE")
        {
            statusMessage.scoreMessage = scoreMessageElement.innerHTML;
        }
        else if (status === "RESUME")
        {
            message = statusMessage.scoreMessage;
        }
    }

    scoreMessageElement.innerHTML = message;

    if (status === "START")
    {
        statusMessage.helpMessage = scoreMessageHelpElement.innerText;
        scoreMessageHelpElement.innerText = "";

        if (currentSet > 1)
        {
            scoreMessageElement.style.color = "white";
        }
    }
}

function setAndGamePopupMessage(options)
{
    let countOpenClose = 1;
    let playerPoints = gameStats.playerScore;
    let computerPoints = gameStats.computerScore;
    const popupMessage = options.endOfSetPopupMessage;
    const textTimeoutStyle = popupMessage.styleTimeout;
    const textTimeoutInput = popupMessage.inputTimeout;

    if (!popupMessage.active)
    {
        let color, text;

        if (playerPoints > computerPoints)
        {
            color = "green";
            text = createMessage((playerPoints - computerPoints), "victory");
        }
        else if (playerPoints < computerPoints)
        {
            color = "red";
            text = createMessage((computerPoints - playerPoints), "loss");
        }
        else if (playerPoints === computerPoints)
        {
            color = "grey";
            text = createMessage(0, "draw");
        }

        const messageWrapper = popupMessage.messageObject = definePopupMessage(text, color);

        setTimeout(() => 
        {
            setTimeout(() =>
            {
                messageWrapper.style.transform = "translate(-50%, -50%) rotate(720deg) scale(2.5)";
                popupMessage.initialTimepoint = Date.now();
                popupMessage.active = true;
            });

            toggleInteractivity("", contentElement, messageWrapper, countOpenClose);
        });
    }

    textTimeoutStyle.ID = setTimeout(() =>
    {
        countOpenClose++;
        const messageWrapper = popupMessage.messageObject;
        messageWrapper.style.transform = "translate(-50%, -50%) rotate(0) scale(0)";
        toggleInteractivity("", contentElement, messageWrapper, countOpenClose);
        countOpenClose = 0;
    }, textTimeoutStyle.duration);

    textTimeoutInput.ID = setTimeout(() =>
    {
        let currentSet = gameStats.setCounter;
        let message = "Winner of a next move wins this set.";
        let color = "white";

        if (playerPoints !== computerPoints)
        {
            let setsWonPlayer = gameStats.setsWon.player;
            let setsWonComputer = gameStats.setsWon.computer;
            color = setsWonPlayer === setsWonComputer ? "grey" :
                setsWonPlayer > setsWonComputer ? "green" : "red";
            let description;
            let helpMessage = "( Click RESET to play a new match. )";
            const statusMessage = options.statusMessage;

            if (setsWonPlayer < 3 && setsWonComputer < 3)
            {
                description = setsWonPlayer === setsWonComputer ? "It is tie in sets" :
                    setsWonPlayer > setsWonComputer ? "YOU are leading in sets" : "YOU fall behind in sets";
                let nextSet = currentSet + 1;
                let numberSuffix = nextSet > 3 ? "th" : nextSet === 3 ? "rd" : "nd";
                helpMessage = statusMessage.helpMessage.replace(/\d[a-z]{2}/, `${nextSet}${numberSuffix}`);
            }
            else if (setsWonPlayer === 3)
            {
                description = "YOU won this match";
            }
            else if (setsWonComputer === 3)
            {
                description = "YOU lost this match";
            }

            message = `${description}: ${setsWonPlayer} - ${setsWonComputer}`;
            scoreMessageHelpElement.innerText = statusMessage.helpMessage = helpMessage;

            playerScoreElement.innerText = 0;
            computerScoreElement.innerText = 0;
        }

        scoreMessageElement.innerText = message;
        scoreMessageElement.style.color = color;

        popupMessage.active = false;
        popupMessage.messageObject = "";
        textTimeoutStyle.duration = 5000;
        textTimeoutInput.duration = 5500;
    }, textTimeoutInput.duration);
}

const createMessage = (difference, outcome) =>
{
    const messageElement = getMessage(outcome);

    let id;
    let bonusMessageChoices = Object.keys(messageElement).length - 1;

    if (outcome === "draw")
    {
        id = Math.ceil(Math.random() * bonusMessageChoices);
    }
    else
    {
        id = difference <= 2 ? bonusMessageChoices - 2 :
            difference <= 5 ? bonusMessageChoices - 1 : bonusMessageChoices;
    }

    let mainMessage = messageElement.mainMessage;
    const bonusElement = messageElement["option" + id];
    let bonusMessage = bonusElement[0];
    let emoticon = bonusElement[1];

    return `${mainMessage}_${bonusMessage}_${emoticon}`;
}

const getMessage = (outcome) =>
{
    const statements =
    {
        loss:
        {
            mainMessage: "Too bad!<br/>YOU lost this set!",
            option1: ["You almost had it!", "&#128547"],
            option2: ["Try harder next time!", "&#128577"],
            option3: ["Were you even playing?!", "&#128565"]
        },
        victory:
        {
            mainMessage: "Well done!<br>YOU won the set!",
            option1: ["That was a close call!", "&#128518"],
            option2: ["You make it look so easy!", "&#128512"],
            option3: ["You're on fire today!", "&#128526"]
        },
        draw:
        {
            mainMessage: "It can't be draw.<br/>First to win a point<br/>wins this set.",
            option1: ["No winner, no fun.", "&#128530"],
            option2: ["No pressure.", "&#128554"],
            option3: ["You may win, you may lose.", "&#128533"]
        }
    };

    return statements[outcome];
}

const definePopupMessage = (text, color) =>
{
    let id = "popup-message";
    const messageWrapper = gameStats.setCounter > 1 ?
        document.getElementById(id) : contentElement.appendChild(popupMessageElement(id));
    const messageParagraphs = messageWrapper.children;
    const textElements = text.split("_");

    for (let i = 0; i < messageParagraphs.length; i++)
    {
        const element = messageParagraphs[i];
        element.innerHTML = textElements[i];

        if (i === 1)
        {
            element.style.setProperty("--bonus-text-shadow-color", color);
        }
    }

    messageWrapper.style.transition = "transform 0.5s linear";
    messageWrapper.style.color = color;

    return messageWrapper;
}

const popupMessageElement = (id) =>
{
    const messageWrapper = document.createElement("div");

    for (let i = 0; i < 3; i++)
    {
        const paragraph = document.createElement("p");

        if (i === 1)
        {
            paragraph.id = "bonus-message";
        }

        messageWrapper.appendChild(paragraph);
    }

    messageWrapper.id = id;

    return messageWrapper;
}

export { updateStatusMessage, setAndGamePopupMessage }