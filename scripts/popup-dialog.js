import { gameStats } from "./index.js";
import dragPopupDialog from "./popup-dialog-dragging.js";
import togglePopupDialog from "./toggle-popup-dialog.js";

function getPopupDialog(gameStats, dialogType, options)
{
    let clicks = dialogType.clickAmmount;
    let dialogID = dialogType.ID;

    if(clicks === 0)
    {
        let dialogName = dialogType.name;
        const popupDialog = document.createElement("div");
        const mainElement = dialogName === "table" ? generateTable() : generateHelpOrAboutDialog(dialogName);
        const divider = document.createElement("hr");
        const logo = logoDiv();
        const closingX = closingXElement();
    
        popupDialog.id = dialogID;
    
        popupDialog.appendChild(mainElement);
        popupDialog.appendChild(divider);
        popupDialog.appendChild(logo);
        popupDialog.appendChild(closingX);

        togglePopupDialog(popupDialog, gameStats, options, closingX);
        dragPopupDialog(popupDialog);
    
        return popupDialog;
    }
    else
    {
        const popupDialog = document.getElementById(dialogID);
        return popupDialog;    
    }
};

const generateTable = () =>
{
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableHeadRow = document.createElement("tr");
    const tableHeadRowTh = document.createElement("th");
    tableHeadRowTh.setAttribute("colspan", 7);
    const tableHeadRowThSpan = document.createElement("span");
    tableHeadRowThSpan.classList.add("table-title");
    tableHeadRowThSpan.textContent = "result table";
    
    table.appendChild(tableHead).appendChild(tableHeadRow).
        appendChild(tableHeadRowTh).appendChild(tableHeadRowThSpan);
    
    const tableBody = document.createElement("tbody");
    
    for(let i = 0; i < 3; i++)
    {
        const tableRow = document.createElement("tr");
        
        for(let j = 0; j < 7; j++)
        {        
            const tableCell = i === 0 || j === 0 ?
                document.createElement("th") : document.createElement("td");
                    
            if(i === 0)
            {
                if(j === 0)
                {
                    tableCell.innerText = "Opponents";
                }
                else if(j <= 5)
                {
                    tableCell.innerText = "Set " + j;
                }
                else
                {
                    tableCell.innerText = "Sets Result";
                }
            }
            else if(i === 1)
            {
                if(j === 0)
                {    
                    tableCell.innerText = "You";
                    tableCell.id = "player";
                }
                else if(j <= 5)
                {
                    tableCell.innerHTML = "-";
                    tableCell.id = "player-set-" + j;
                }
                else
                {
                    tableCell.innerText = 0;
                    tableCell.id = "player-set-result";
                }
            }
            else if(i === 2)
            {
                if(j === 0)
                {
                    tableCell.innerText = "Com";
                    tableCell.id = "computer";
                }
                else if(j <= 5)
                {
                    tableCell.innerHTML = "-";
                    tableCell.id = "computer-set-" + j;
                }
                else
                {
                    tableCell.innerText = 0;
                    tableCell.id = "computer-set-result";
                }
            }

            tableRow.appendChild(tableCell);
        }

        tableBody.appendChild(tableRow);
    }

    table.appendChild(tableBody);

    return table;
}

function generateHelpOrAboutDialog(dialogName)
{
    // const jsonContent = getJsonContent(dialogName);

    // jsonContent.then((content) =>
    // {
        const dialogTitle = document.createElement("div");
        dialogTitle.classList.add("dialog-title");

        const listFrame = document.createElement("div");
        listFrame.classList.add("list-frame");
    // });

    return dialogTitle;
}

const logoDiv = () =>
{
    const logoDiv = document.createElement("div");
    logoDiv.classList.add("logo");
    const logoImg = document.createElement("img");
    logoImg.src = "../images/logo.png";
    logoImg.alt = "logo";
    logoDiv.appendChild(logoImg);

    return logoDiv;
}

function resultTableSetAndStyleUpdate(gameStats, setCount)
{
    document.getElementById("player-set-" + setCount).innerText = gameStats["set" + setCount].player;
    document.getElementById("computer-set-" + setCount).innerText = gameStats["set" + setCount].computer;
}

const closingXElement = () =>
{
    const closingX = document.createElement("div");
    closingX.id = "closing-x-symbol";
    closingX.classList.add("non-interactive");

    return closingX;
};

export { getPopupDialog, resultTableSetAndStyleUpdate};
