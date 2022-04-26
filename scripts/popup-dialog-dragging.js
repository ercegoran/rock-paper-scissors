export default function dragPopupDialog(popupDialog)
{
    let x, y;
    let initialX, initialY;
    let containerWidth, containerHeight;

    popupDialog.addEventListener("mousedown", dragStart);
    popupDialog.addEventListener("touchstart", dragStart, { passive: false });

    function dragStart(event)
    {
        let eventType = event.type === "mousedown" ? event : event.changedTouches[0];
        const container = popupDialog.parentNode;
        
        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;

        x = eventType.clientX;
        y = eventType.clientY;
        initialX = x - popupDialog.offsetLeft;
        initialY = y - popupDialog.offsetTop;
        
        popupDialog.style.cursor = "grabbing";

        document.addEventListener("mousemove", dragging);
        document.addEventListener("touchmove", dragging, { passive: false });
        document.addEventListener("mouseup", dragStop);
        document.addEventListener("touchend", dragStop, { passive: false });
    }

    const dragging = (event) =>
    {
        event.preventDefault();

        let eventType = event.type === "mousemove" ? event : event.changedTouches[0];
        let mousePositionX = eventType.clientX;
        let mousePositionY = eventType.clientY;
        let dialogOffsetX = popupDialog.offsetLeft;
        let dialogOffsetY = popupDialog.offsetTop;

        x -= mousePositionX;
        y -= mousePositionY;

        let styleLeft = (dialogOffsetX - x) / containerWidth * 100;
        let styleTop = (dialogOffsetY - y) / containerHeight * 100;

        if(styleLeft >= 0 && styleLeft <= 100)
        {
            popupDialog.style.left = styleLeft + "%";
            x = mousePositionX;
        }
        else
        {
            styleLeft = dialogOffsetX / containerWidth * 100;
            popupDialog.style.left = styleLeft + "%";
            x = dialogOffsetX + initialX;
        }

        if(styleTop >= 0 && styleTop <= 100)
        {
            popupDialog.style.top = styleTop + "%";
            y = mousePositionY;
        }
        else
        {
            styleTop = dialogOffsetY / containerHeight * 100;
            popupDialog.style.top = styleTop + "%";
            y = dialogOffsetY + initialY;
        }
    }

    const dragStop = () =>
    {
        popupDialog.style.cursor = "grab";
        document.removeEventListener("mousemove", dragging);
        document.removeEventListener("touchmove", dragging);
    }
}