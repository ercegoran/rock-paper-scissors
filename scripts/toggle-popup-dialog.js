import { gameStats } from "./index.js";
import { bodyElement, contentElement } from "./html-elements.js";
import toggleInteractivity from "./interactivity_tweaker.js";
import { startTimeCounter } from "./time-counter.js";
import { updateStatusMessage } from "./messages-tweaker.js";
import { mouseAndTouchAction } from "./mouse-and-keyboard-handlers.js";

export default function togglePopupDialog(popupDialog, options, closingXElement)
{
    const NON_INTERACTIVE = "non-interactive";
    let sourceType = options.clickSource.popup;

    mouseAndTouchAction(closingXElement, options, closePopupDialog, sourceType);

    const bodyElementStyle = bodyElement.style;
    const closingXElementClasses = closingXElement.classList;
    
    let countOpenClose = 0;
    
    popupDialog.addEventListener("animationstart", (e) =>
    {
        countOpenClose++;
        popupDialog.parentNode.style.perspective = "7em";
        toggleInteractivity(e, contentElement, popupDialog, countOpenClose);
    });

    popupDialog.addEventListener("animationend", () =>
    {
        const dialogOptions = options.popupDialog;
        let dialogOpened = countOpenClose % 2 !== 0;
        popupDialog.parentNode.style.perspective = "none";
        
        if(dialogOpened)
        {
            dialogOptions.currentDialogID = popupDialog.id;
            closingXElementClasses.remove(NON_INTERACTIVE);
            bodyElementStyle.overflowY = "hidden";

            console.log(dialogOptions.currentDialogID);
        }
        else
        {
            if(gameStats.timeIsRunning)
            {
                updateStatusMessage("RESUME", options);
            }

            dialogOptions.active = false;
            dialogOptions.currentDialogID = "";
            closingXElementClasses.add(NON_INTERACTIVE);
            bodyElementStyle.overflowY = "visible";
        }
    });
}

const closePopupDialog = (popupDialog, options) =>
{
    const dialogClasses = popupDialog.classList;
    let positionMiddleOrBelow = parseInt(contentElement.offsetHeight / 2) >= popupDialog.offsetTop - popupDialog.clientTop;

    dialogClasses.remove("show-popup-dialog");

    const timer = options.timer;
        
    if(!gameStats.timeIsRunning)
    {
        if(options.startTitle.text === "PAUSE")
        {
            options.startTitle.text = "";

            if(gameStats.setTimer !== 0)
            {
                timer.ID = startTimeCounter(options);
            }
        }
        else if(options.startTitle.text === "RESUME")
        {
            options.startTitle.text = "PAUSE";
        }
    }

    setTimeout(() => 
    {
        popupDialog.style.setProperty("--scale", "scale(0)");

        if(positionMiddleOrBelow)
        {
            dialogClasses.add("hide-popup-dialog");
        }
        else
        {
            dialogClasses.add("hide-popup-dialog-below");
        }
    }, options.clickSource.clickTimeout);
}