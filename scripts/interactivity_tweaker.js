export default function toggleInteractivity(action, gameStats, elementGroup, popupObject, countOpenClose)
{
    const popupObjectStyle = window.getComputedStyle(popupObject);
    let actionType = action instanceof Event ? action.type : action;
    const animationProperties = getAnimationProperties(actionType, popupObjectStyle, countOpenClose);

    const elements = elementGroup.children.length > 0 ? elementGroup.children : elementGroup;
    
    iterateThroughElements(elements, gameStats, popupObject, animationProperties);
}

const iterateThroughElements = (elements, gameStats, popupObject, animationProperties) =>
{
    let isOpen = animationProperties.isOpen;
    let duration = animationProperties.duration;
    let nonInteractive = "non-interactive";
    let hr = "HR";
    let filter = "--filter";

    for(let element of elements)
    {
        if(element !== popupObject)
        {
            const elementClasses = element.classList;
            let id = element.id;
            let gameplayElements = id === "rock" || id === "paper" || id === "scissors";
            let childrenCount = element.children.length;
            let nodeName = element.nodeName;

            let groupedElements = id === "score-panel" ||
                id === "score-description" ||
                gameplayElements ||
                id === "time-counter" ||
                nodeName === "HR";
            
            if(!groupedElements)
            {
                if(childrenCount > 0)
                {
                    iterateThroughElements(element.children, gameStats, popupObject, animationProperties);
                }
            }
        
            if(!isOpen)
            {
                if(childrenCount === 0 || groupedElements)
                {
                    if(nodeName !== "HR")
                    {
                        elementClasses.add(nonInteractive);
                    }
                    else
                    {
                        element.style.setProperty(filter, "saturate(110%) brightness(50%) contrast(70%) opacity(70%)");
                    }
                }
            }
            else
            {
                let equalScore = (gameStats.playerScore === gameStats.computerScore);
                let setPaused = (!gameStats.timeIsRunning && gameStats.setTimer > 0);
                let setEnded = (!gameStats.timeIsRunning && gameStats.setTimer === 0);
                
                if(gameplayElements)
                {
                    if(setEnded)
                    {
                        if(gameStats.setCounter === 0 || !equalScore)
                        {
                            continue;
                        }
                    }
                    else if(setPaused)
                    {
                        continue;
                    }
                }

                if(id === "start-pause")
                {
                    if(setEnded)
                    {
                        if(gameStats.setCounter > 0 && equalScore)
                        {
                            continue;
                        }
                    }
                }

                if(id === "reset" && gameStats.setCounter === 0)
                {
                    continue;
                }

                setTimeout(() =>
                {
                    if(nodeName !== hr)
                    {
                        elementClasses.remove(nonInteractive);
                    }
                    else
                    {
                        element.style.setProperty(filter, "none");
                    }
                }, duration);
            }
        }
    }
}

const getAnimationProperties = (actionType, style, countOpenClose) =>
{
    let regex = /\d\.\d*/;
    let isOpened = countOpenClose % 2 === 0;
    
    return actionType === "animationstart" ?
        {
            isOpen: isOpened,
            duration: parseFloat(style.animationDuration.match(regex)[0]) * 1000
        } :
        {
            isOpen: isOpened,
            duration: parseFloat(style.transition.match(regex)[0]) * 1000
        }
}