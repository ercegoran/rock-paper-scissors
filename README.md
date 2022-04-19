# **Rock-Paper-Scissors game**

This is a modified, and improved version of a wordly famous **Rock-Paper-Scissors** game, made for web browser.

Initial concept formed by loosely following a You-Tube video tutorial:   
**[Web Development Tutorial - JavaScript, HTML, CSS - Rock Paper Scissors Game](https://www.youtube.com/watch?v=jaVNP3nIAv0)** ( _featured on **[freeCodeCamp.org](https://www.youtube.com/watch?v=jaVNP3nIAv0)**, and created by **[Whatsdev](https://www.youtube.com/channel/UC0tRdbXVDbhaRvZPKsRgmxg)**_ ).

## **Idea, and inspiration**

From the very start, I did not have the intention for this to become a personal project, since the game itself is pretty basic.
I have started making it by vaguely following the above mentioned tutorial for the purpose of learning how some vanilla Java Script concepts work, in conjunction with HTML, and CSS.

## **Initial features**

Play a game against a computer. There is no aditional options nor the time limit, so it can be played as long as desired. Game is also not responsive.

Existing features were:
- Game panel with available choices, **rock**, **paper** or **scissors**. On each move, image that represents Your choice, and image that represents computer's choice are being highlighted with 1 of the 3 possible colors, depending on the result:
    - **Green** - victory
    - **Gray** - draw
    - **Red** - loss
- Score board.
- Result message that changes based on a result.

## **Newly added features**

Additional functionality, elements, styling, and logic added by me, for now, are as following:
- Visual changes:
    - Added background image which I've downloaded from **[WallpaperCave](https://wallpapercave.com/w/wp2088351)**.
    - Changed images of **rock**, **paper**, and **scissors** playing elements. Images I used can be found at **[Wikipedia](https://en.wikipedia.org/wiki/Rock_paper_scissors#/media/File:Rock-paper-scissors.svg)**.
    - Implemented **START**, and **RESET** buttons as game controllers.
    - Implemented **Help**, **Result Table**, and **About** popup dialogs, as well as their respective buttons for activating each one of them.
    - Implemented a circular **timer** for timing each set of the game. It's situated below **START**, and **RESET** buttons.
    - Added an animated message at the end of each set, that describes set score.
- Game logic, and rules:
    - Introduced sets. Game has a maximum of 5 sets, and the winner is the first one who wins 3 sets.
    - Each set lasts for 30 seconds. If it's a draw when timer reaches 0, set goes to anyone who wins a next move.
- Game commands, and other funcionality:
    - **START** button as its name suggests, starts a set/game, but it's also used to pause, and resume set/game, while **RESET** button completely restarts a game.
    - Clicking either **Help**, **Result Table** or **About**, activates each of its respective dialogs, and upon their activation, set/game is paused.
    - Above mentioned popup dialogs can also be dragged across the screen, but there is no danger of dragging them off the screen. Their opening, and closing sequence, is animated.
    - Set/game is also paused when its tab is out of focus.
    - Game is completely responsive, and can be played on almost any type of device.
    - Asside from mouse, game can also be played, and controlled, with a keyboard. Every action has its respective keyboard shortcut.