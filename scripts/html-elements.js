const bodyElement = document.getElementsByTagName("body")[0];
const headerElement = document.getElementById("header");
const h1Element = document.getElementsByTagName("H1")[0];
const contentElement = document.querySelector(".content-wrapper");
const scoreBoardElement = document.getElementById("score-panel");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const scoreMessageWrapperElement = document.getElementById("score-description");
const scoreMessageElement = document.getElementById("score-message");
const scoreMessageHelpElement = document.getElementById("help-message");
const choicePanelElement = document.querySelector(".choices");
const choiceElements = document.querySelectorAll(".choice");
const rockElement = document.getElementById("rock");
const paperElement = document.getElementById("paper");
const scissorsElement = document.getElementById("scissors");
const buttonsAndTimerElement = document.querySelector(".buttons-and-timer");
const commandButtonsElement = document.querySelectorAll(".command-button");
const infoButtonsElement = document.querySelectorAll(".info-button");
const startButtonElement = document.getElementById("start-pause");
const resetButtonElement = document.getElementById("reset");
const scoreTableButtonElement = document.getElementById("show-score-table");
const helpButtonElement = document.getElementById("game-help");
const aboutButtonElement = document.getElementById("about-game");
const counterWrapperElement = document.getElementById("time-counter");
const counterElement = document.getElementById("counter");
const timeBarElement = document.querySelector(".time-bar");
const leftBarElement = document.getElementById("left-bar");
const rightBarElement = document.getElementById("right-bar");
const emptyBarElement = document.getElementById("empty-bar");
const buttonSectionHrElement = document.querySelector(".buttons-and-timer hr");

export
{
    bodyElement, headerElement, h1Element, contentElement, scoreBoardElement, playerScoreElement,
    computerScoreElement, scoreMessageWrapperElement, scoreMessageElement, scoreMessageHelpElement,
    choicePanelElement, choiceElements, rockElement, paperElement, scissorsElement,
    buttonsAndTimerElement, commandButtonsElement, infoButtonsElement, startButtonElement,
    resetButtonElement, scoreTableButtonElement, helpButtonElement, aboutButtonElement,
    counterWrapperElement, counterElement, timeBarElement, leftBarElement,
    rightBarElement, emptyBarElement, buttonSectionHrElement
};

