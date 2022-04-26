import
{
    playerScoreElement, computerScoreElement, scoreMessageElement, choiceElements,
    rockElement, paperElement, scissorsElement
} from "./html-elements.js";
import { gameStats } from "./index.js";
import { timerReachedZero } from "./time-counter.js";
import { mouseAndTouchAction } from "./mouse-and-keyboard-handlers.js";

const WINNER_GLOW = "rgba(0, 128, 0, 0.7)";
const LOSER_GLOW = "rgba(255, 0, 0, 0.7)";

/**
 * Function for attaching "click" event listeners
 * on game elements.
 * @param {object} score - keeping track of score in each set
 */
export default function defineGameElementsBehavior(options)
{
    let sourceType = options.clickSource.gameplay;

    choiceElements.forEach(element => 
    {
        mouseAndTouchAction(element, options, gameplayElementClicked, sourceType);
    })
}

const gameplayElementClicked = (event, options) =>
{
    let computerChoice = getComputerChoice();
    let playerChoice = event.target;
    gameStats.movesPlayed++;

    if(playerChoice === computerChoice)
    {
        drawResult(playerChoice, computerChoice);
    }
    else if((playerChoice === rockElement && computerChoice === scissorsElement) ||
        (playerChoice === paperElement && computerChoice === rockElement) ||
        (playerChoice === scissorsElement && computerChoice === paperElement))
    {
        playerWon(playerChoice, computerChoice, options);
    }
    else
    {
        playerLost(playerChoice, computerChoice, options);
    }
}

/**
 * Function for randomly choosing one of the 3 elements.
 * It represents a computer choice in the game.
 */
const getComputerChoice = () =>
{
    let choices = [rockElement, paperElement, scissorsElement];
    let randomChoice = Math.floor(Math.random() * choices.length);
    return choices[randomChoice];
}

/**
 * If both opponents made an identical choice in a current move, 
 * this function is being called. It calls 2 functions. 
 * One which finishes update of a result message and other 
 * which adds proper game effect.
 * @param {string} playerChoice - players choice
 * @param {string} computerChoice - computers choice
 */
const drawResult = (playerChoice, computerChoice) =>
{
    const drawGlow = "rgba(128, 128, 128, 0.7)";
    updateResultMessage(playerChoice.id, computerChoice.id, " is same as ", "DRAW");
    inGameEffects(playerChoice, computerChoice, drawGlow, drawGlow);
}

/**
 * If player wins a move, this function is being called.
 * It updates score after each move, generates description message
 * and at the end, it also calls 2 functions. 
 * One which finishes update of a result message and other 
 * which adds proper game effect.
 * @param {string} playerChoice - players choice
 * @param {string} computerChoice - computers choice
 */
const playerWon = (playerChoice, computerChoice, options) =>
{
    gameStats.playerScore++;
    playerScoreElement.innerText = gameStats.playerScore;
    let setTimer = gameStats.setTimer;
    let scoreDescription;

    if(setTimer === 0 && !gameStats.timeIsRunning)
    {
        setTimeout(() =>
        {
            timerReachedZero(setTimer, options);
        }, options.clickSource.clickTimeout);
    }
    
    switch(playerChoice)
    {
        case paperElement:
            scoreDescription = " wrapped around ";
            break;
        case rockElement:
            scoreDescription = " smashed ";
            break;
        case scissorsElement:
            scoreDescription = " cut ";
            break;
        default:
            scoreDescription = "";
            break;
    }

    updateResultMessage(playerChoice.id, computerChoice.id, scoreDescription, "victory");
    inGameEffects(playerChoice, computerChoice, WINNER_GLOW, LOSER_GLOW);
}

/**
 * If computer wins a move, this function is being called.
 * It updates score after each move, generates description message
 * and at the end, it also calls 2 functions. 
 * One which finishes update of a result message and other 
 * which adds proper game effect.
 * @param {string} playerChoice - players choice
 * @param {string} computerChoice - computers choice
 */
const playerLost = (playerChoice, computerChoice, options) =>
{
    gameStats.computerScore++;
    computerScoreElement.innerText = gameStats.computerScore;
    let setTimer = gameStats.setTimer;
    let scoreDescription;
    
    if(setTimer === 0 && !gameStats.timeIsRunning)
    {
        setTimeout(() =>
        {
            timerReachedZero(setTimer, options);
        }, options.clickSource.clickTimeout);
    }
    
    switch(playerChoice)
    {
        case paperElement:
            scoreDescription = " got cut by ";
            break;
        case rockElement:
            scoreDescription = " got wrapped in ";
            break;
        case scissorsElement:
            scoreDescription = " got smashed by ";
            break;
        default:
            scoreDescription = "";
            break;
    }
    
    updateResultMessage(playerChoice.id, computerChoice.id, scoreDescription, "loss");
    inGameEffects(playerChoice, computerChoice, LOSER_GLOW, WINNER_GLOW);
}

/**
 * This function displays a result message, 
 * highlithing player and computer choices
 * with a description, after each move.
 * @param {string} playerChoice - players choice
 * @param {string} computerChoice = computers choice
 */
const updateResultMessage = (playerChoice, computerChoice, scoreDescription, scoreMessage) =>
{
    let playerColor = "gray";
    let computerColor = "gray";

    switch(scoreMessage)
    {
        case "victory":
            playerColor = "green";
            computerColor = "red";
            scoreMessage = "YOU WON";
            break;
        case "loss":
            playerColor = "red";
            computerColor = "green";
            scoreMessage = "YOU LOST";
            break;
        default:
            break;
    }

    scoreMessageElement.innerHTML = `<span style="color: ${playerColor}">${playerChoice.toUpperCase()}</span> 
    ${scoreDescription} <span style="color: ${computerColor}">${computerChoice.toUpperCase()}</span><br>
    Result: <span style="color: ${playerColor}">${scoreMessage}</span>`;
}

/**
 * Function which adds proper game effects at the moment
 * both opponents have made their choices.
 * It fills the choice pictures with the proper color and
 * prints who's choice it was on top of them.
 * At the end, the method is being called to remove the
 * effects after 0.5 seconds, so that everything looks like
 * a short blink animation.
 * @param {string} choice1 - players choice
 * @param {string} choice2 - computers choice
 * @param {string} glow1 - players score glow
 * @param {string} glow2 - computers score glow
 */
const inGameEffects = (choice1, choice2, glow1, glow2) =>
{
    let sameResult = choice1 === choice2;
    let currentTime = gameStats.setTimer;
    let effectTimeout = currentTime === 1 || currentTime === 0 && !sameResult ?
        100 : 250;

    let playerLabel = "YOU";
    let computerLabel = "COM";
    playerLabel = !sameResult ? playerLabel : `${playerLabel}\nand\n${computerLabel}`;
    
    const playerChoice = choice1;
    defineEffects(playerChoice, glow1, effectTimeout, playerLabel);

    if(!sameResult)
    {
        const computerChoice = choice2;
        defineEffects(computerChoice, glow2, effectTimeout, computerLabel);
    }
}

const defineEffects = (choice, glow, timeout, label) =>
{
    const choiceStyle = choice.style;
    const choiceChildren = choice.children;
    const choiceImg = choiceChildren[0];
    const choiceImgStyle = choiceImg.style;

    const choiceLabel = textOverChoiceImage(label);
    choice.appendChild(choiceLabel);
    
    choiceStyle.background = glow;
    choiceImgStyle.opacity = 0.2;

    setTimeout(() => 
    {
        choiceStyle.background = "none";
        choiceImgStyle.opacity = 1;
        choice.removeChild(choiceLabel);
    }, timeout);
}

/**
 * Function that addds each opponent display name
 * on top of an image which represents
 * a choice that's being made.
 * @param {string} opponent - either player or computer
 */
const textOverChoiceImage = (opponent) =>
{
    const element = document.createElement("div");
    element.classList.add("add-text-to-image");
    element.innerText = opponent;

    return element;
}