import { gameStats } from "./index.js";

function mouseAndTouchAction(element, options, action, sourceType)
{
    const triggerEvents = ["mousedown", "touchstart"];
    const clickSource = options.clickSource;
    let clickTimeout = clickSource.clickTimeout;
    const elementClasses = element.classList;
    let sourceName = sourceType.name;
    let clickStyle = sourceType.styling;
    
    triggerEvents.forEach(e =>
    {
        element.addEventListener(e, (e) => 
        {
            let mouseLeftOrTouch = e.type === "touchstart" || e.button === 0;

            if(mouseLeftOrTouch && clickSource.eventCalled === 0 && clickSource.clickCount <= 1)
            {
                const actionArgs = [options];

                if(e.type === "touchstart")
                {
                    if(e.cancelable)
                    {
                        e.preventDefault();
                    }

                    if(sourceName === "gameplay")
                    {
                        elementClasses.add(clickStyle);

                        setTimeout(() => elementClasses.remove(clickStyle), clickTimeout);
                    }
                }
                else
                {
                    clickSource.eventCalled++;
                    clickSource.clickCount++;
                }
                
                if(sourceName === "buttons" || sourceName === "gameplay")
                {
                    actionArgs.unshift(e);
                }
                else if(sourceName === "popup")
                {
                    actionArgs.unshift(element.parentNode);
                }
                
                if(sourceName === "buttons")
                {
                    if(element.id === "start-pause")
                    {
                        let pauseActive = "start-button-pause-mode";

                        if(elementClasses.contains(pauseActive))
                        {
                            elementClasses.remove(pauseActive);
                            clickStyle = "start-button-clicked-in-pause";
                        }
                        else
                        {
                            clickStyle = sourceType.styling;
                        }
                    }

                    buttonActionArguments(element, actionArgs, sourceType);
                }

                if(sourceName !== "gameplay")
                {
                    elementClasses.add(clickStyle);
                }

                action(...actionArgs);

                setTimeout(() => 
                {
                    if(sourceName !== "gameplay")
                    {
                        elementClasses.remove(clickStyle);
                    }

                    clickSource.eventCalled = 0;
                    clickSource.clickCount = 0;
                }, clickTimeout);
            }
        });
    });

    element.addEventListener("mouseup", (e) =>
    {
        if(e.button === 0)
        {
            clickSource.clickCount++;
        }
    });

    element.addEventListener("click", (e) =>
    {
        if(clickSource.eventCalled === 0 && clickSource.clickCount === 0)
        {
            const actionArgs = [options];

            if(sourceName === "buttons")
            {
                buttonActionArguments(element, actionArgs, sourceType);
            }

            clickSource.eventCalled++;
            
            setTimeout(() => clickSource.eventCalled = 0, clickTimeout);

            if(sourceName === "buttons" || sourceName === "gameplay")
            {
                actionArgs.unshift(e);    
            }
            else if(sourceName === "popup")
            {
                actionArgs.unshift(element.parentNode);
            }

            action(...actionArgs);
        }
            
        clickSource.clickCount = 0;
    });
}

const buttonActionArguments = (element, actionArgs, sourceType) =>
{
    sourceType.types.forEach((arg) => 
    {
        if(element.classList.contains(arg))
        {
            actionArgs.push(arg);
            return;
        }
    });
}

function keyboardClick(entryList, options)
{
    document.addEventListener("keydown", (e) =>
    {
        if(entryList.clickCounter < 1)
        {
            keyAction(e, entryList, options);
        }
    });

    document.addEventListener("keyup", () => 
    {
        if(entryList.clickCounter > 0)
        {
            entryList.clickCounter = 0;
        }
    });
}

const keyAction = (e, entryList, options) =>
{
    const popupDialog = options.popupDialog;
    const closingX = entryList.popup.Escape;

    for(let entry in entryList)
    {
        const entries = entryList[entry];
        const keyCode = e.code;
        const clickedEntry = entries[keyCode];
        
        if(clickedEntry)
        {
            let entryLength = Object.keys(clickedEntry).length;
            let hasActivatedPopupWindow = popupDialog.active && clickedEntry.activates === popupDialog.currentDialogID;
            const clickedObject = entryLength > 0 ? hasActivatedPopupWindow ?
                closingX : clickedEntry.target : clickedEntry;
            let objectActive = !clickedObject.classList.contains("non-interactive");
            let clickStyle = clickedObject === closingX ? entryList.popup.clickClass : entries.clickClass;
            
            if(objectActive)
            {
                elementStyleTogglerAndAction(clickedObject, clickStyle);
                entryList.clickCounter++;
            }
        }
    }
}
    
const elementStyleTogglerAndAction = (clickedObject, clickStyle) =>
{
    const clickedObjectClasses = clickedObject.classList;
    
    if(clickedObject.id === "start-pause")
    {
        let pauseActive = "start-button-pause-mode";

        if(clickedObjectClasses.contains(pauseActive))
        {
            clickedObjectClasses.remove(pauseActive);
            clickStyle = "start-button-clicked-in-pause";
        }
    }
    
    clickedObject.click();
    clickedObjectClasses.add(clickStyle);
    
    setTimeout(() => clickedObjectClasses.remove(clickStyle), 100);
}

export { keyboardClick, mouseAndTouchAction };