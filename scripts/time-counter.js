import
{
    startButtonElement, counterWrapperElement, counterElement, leftBarElement,
    rightBarElement, timeBarElement, buttonSectionHrElement
} from "./html-elements.js";
import { gameStats, options } from "./index.js";
import { resultTableSetAndStyleUpdate } from "./popup-dialog.js";
import { setAndGamePopupMessage } from "./messages-tweaker.js";

function startTimeCounter()
{
    let timePoint = gameStats.setTimer;
    let timer = options.timer;

    if(timer.callCount === 0)
    {
        timeCounterInitialize(timePoint, 1.5, "0.25em");
    }

    timer.callCount++;
    gameStats.timeIsRunning = true;

    let interval = setInterval(() =>
    {
        let currentTime = --gameStats.setTimer;
        let timePosition = (gameStats.SET_DURATION - gameStats.setTimer) * 12;
        counterElement.innerText = gameStats.setTimer < 10 ? `0${currentTime}` : currentTime;
        leftBarElement.style.transform = `rotate(${timePosition}deg)`;

        if(currentTime === 15)
        {
            timeBarAndCounterTweak(currentTime);
        }
        else if(currentTime === 10)
        {
            timeBarAndCounterTweak(currentTime);
        }
        
        if(currentTime > 0 && currentTime <= 10)
        {
            timeBarAndCounterTweak(currentTime);
        }
        else if(currentTime === 0)
        {
            timer.callCount = 0;
            gameStats.timeIsRunning = false;
            timerReachedZero(currentTime);
        }
    }, 1000);

    return interval;
}

function timerReachedZero(currentTime)
{
    let playerPoints = gameStats.playerScore;
    let computerPoints = gameStats.computerScore;
    let equalScores = playerPoints === computerPoints;
    let setCount = gameStats.setCounter;
    
    if(!equalScores)
    {
        gameStats["set" + setCount].player = playerPoints;
        gameStats["set" + setCount].computer = computerPoints;

        if(playerPoints > computerPoints)
        {
            gameStats.setsWon.player++;
        }
        else if(playerPoints < computerPoints)
        {
            gameStats.setsWon.computer++;
        }

        if(options.popupDialog.resultTable.clickAmmount > 0)
        {
            resultTableSetAndStyleUpdate(setCount);
        }
    }

    setAndGamePopupMessage();
    stopTimeCounter(currentTime);
}

function stopTimeCounter(currentTime)
{
    gameStats.timeIsRunning = false;
    const timer = options.timer;
    const startButtonTitle = options.startTitle;
    
    clearInterval(timer.ID);
    timer.ID = "";
    
    if(currentTime === 0)
    {
        if(gameStats.playerScore !== gameStats.computerScore)
        {
            startButtonTitle.text = startButtonElement.innerText = "START";
            timeCounterInitialize(currentTime, 1, "0.2em");
        }
    }
}

const timeCounterInitialize = (timePoint, sizeMultiplier, barSize) =>
{
    const timeCounterStyle = counterElement.style;
    const counterWrapperStyle = counterWrapperElement.style;

    let setEnd = timePoint === 0;
    counterElement.innerText = setEnd ? "" : timePoint;
    let counterElementWidth = "--timer-width";

    timeCounterStyle.setProperty(counterElementWidth, "1.25em");
    counterWrapperStyle.setProperty("--size-multiplier", sizeMultiplier);
    counterWrapperStyle.setProperty("--bar-size", barSize);

    let hrLineCutAddition = "2%";

    if(setEnd)
    {
        timeCounterStyle.setProperty(counterElementWidth, 0);
        timeBarAndCounterTweak(timePoint);
        hrLineCutAddition = "0%";
    }

    buttonSectionHrElement.style.setProperty("--cut-addition", hrLineCutAddition);
}

const timeBarAndCounterTweak = (currentTime) =>
{
    let rotate;    
    let color;

    if(currentTime === 15)
    {
        rotate = "rotate(180deg)";
        timeBarElement.style.clipPath = "inset(0 0 0 0)";
        rightBarElement.style.transform = rotate;
    }
    else if(currentTime === 10)
    {
        color = "#8b0000";
        counterWrapperElement.style.transition = "transform 0.3s linear";
        counterWrapperElement.style.boxShadow = "0 0 1.7em 0.7em white";
        counterElement.style.color = color;
        leftBarElement.style.borderColor = color;
        rightBarElement.style.borderColor = color;
    }
        
    if(currentTime > 0 && currentTime <= 10)
    {
        counterWrapperElement.style.transform = "scale(1.2)";

        setTimeout(() =>
        {
            counterWrapperElement.style.transform = "scale(1)";
        }, 300);
    }
    else if(currentTime === 0)
    {
        rotate = "rotate(0)";    
        color = "green";
        counterWrapperElement.style.transition = "none";
        counterWrapperElement.style.boxShadow = "none";
        timeBarElement.style.clipPath = "inset(0 0 0 50%)";
        leftBarElement.style.transform = rotate;
        rightBarElement.style.transform = rotate;
        counterElement.style.color = "#292C35";
        leftBarElement.style.borderColor = color;
        rightBarElement.style.borderColor = color;
    }
}

export { startTimeCounter, timerReachedZero, stopTimeCounter };