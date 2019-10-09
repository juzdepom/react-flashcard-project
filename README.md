## Session 1
*🗓 Th, Sep 26, 2019* <br>

🕐 3 PM ⬇️
This will be the first documented session. Have been working on this project for already a week now I believe.

Today, I changed the structure of my hard-coded JSON data a bunch: separated the pronunciation and the Thai characters into two different data objects so that later on if I only want Thai characters to appear, it would be a lot easier to do that. Also made it so that a timestamp was appended to the flashcard object every time we reviewed the flashcard. That way we can go back and see how many times we reviewed a flashcard, AND the time elapsed between each review (might be able to gain personal insight on learning patterns with that data).

Migrated the edit and back buttons onto the card, which lead me to commenting out a bunch of code on App.js. I won't delete anything on this commit. Just leave it as commented out in case I broke anything.

I think I'm getting close to ready to trying out authentication with Firebase. I want to continue keeping a local, hard-coded JSON copy though. I want to start formatting my design so that it is mobile responsive so that there doesn't have to be a massive redesign when I code out the React Native app.

Some things I still want to do before I begin Firebase authentication, and THEN building the React Native app:

◽️ create a “6” rating for mastered card + add crown icon to card with level 5 rating only.<br>
◽️ turn the "eye" into a button so that when you press it, "cardExposureDetails" is activated and when the card was first created (and how many days ago that was), how many times have you looked at it, and the time passed between cards, what rating you gave it for EACH exposure!! <br>
◽️ move the numbers with the boxes to the top of the card, and make it so that when you press on each box category, a list replaces the flashcard showing the list of cards in each box.<br>
◽️ create little tabs on the side of the flashcard that I can press to draw a random card from that specific deck.

So yeah, actually still way more that I want to do before I begin implementing Firebase and then React Native hehe. This is definitely a "marathon" project, not a "sprint" project.

<img src="/screenshots/09-26-2019.png" width="500" alt="09/26/2019">

🕐 8:30 PM ⬇️

#1 can now pick a random card from a specific deck (rating 1-5) by by pressing the key Q, W, E, R, or T.<br>
#1 changed the keyboard event for picking a random card from a specific deck to Shift + 1, 2, 3, 4, or 5 because QWERTY interferes with the search.<br>
#1 added a Github URL to interface

◽️ add those little buttons to the right side of the deck so I can trigger selecting a random card from a specific deck with a mouse event.

Note to self: I think the "go to previous card" option is broken when I navigate back from a card from a preselected deck.

IDEA: 
◽️ create a never looked at deck. Starting giving rating 0.

## Session 2
*🗓 Sat, Sep 28, 2019* <br>

Spend a good portion of today learning the MERN stack in case I wanted to build a more robust backend for the flashcard app. Built [this project](https://github.com/juzdepom/mern-exercise-tracker) 

It's currently midnight. Am pretty pooped. Just managed to connect firebase to the app. It's currently logging to the console but I think it's time to make everything on the Flashcard App load from Firebase now. Tired

## Session 3
*🗓 Sat, Sep 28, 2019* <br>

Cleaned up the code a bunch! Going to study the cards a bit and then build the React Native application! 

<img src="/screenshots/09-29-2019.png" width="400" alt="09/29/2019">

New: everytime we rate 5 flashcards, update the JSON date in firebase.

## Session 4
*🗓 Fri, Oct 4, 2019* <br>
Last time I updated this README I mentioned that I wanted to build the React Native application. Well instead I decided to build the app in Swift and spent two days building it out on my old macbook which then crashed lol. For now will be keeping the app as a Web app.
Figured out how to open my project through localhost on my phone so that's a handy workaround.

```Commit: "#4 added more flashcards, added a button at the bottom and added the goals text of 1000 mastered cards."```

## Session 5
*🗓 Sat, Oct 5, 2019* <br>
Building out the Add Flashcards component

```Commit: "#5 built out the add flashcards component and added a level 0 card deck for cards that have never been reviewed before"```

The add flashcards component also checks the string to make sure that it can be turned into accurate flashcard data! 

<img src="/screenshots/10-05-2019.png" width="400" alt="10-05-2019">

Next task: add the buttons on the side for rating.

```Commit: "#5 added some CSS shading effects. Not entired satisfied but will do for now"```

<img src="/screenshots/10-05-2019--shading.png" width="400" alt="10-05-2019">

```Commit: "#5 Connected the buttons on the right hand side to select a random card from a specific deck"```

## Session 6
*🗓 Su, Oct 6, 2019* <br>

```Commit: #6 took some of the code from App.js and migrated to components and installed node-sass```

```Commit: #6 added a sidedrawer component```

Used this tutorial: [ReactJS - Build a Responsive Navigation Bar & Side Drawer Tutoria](https://www.youtube.com/watch?v=l6nmysZKHFU)

<img src="/screenshots/10-06-2019--drawer.PNG" width="400" alt="10-06-2019 drawer">

```Commit: #6 Altered the aesthetics of the card because I didn't like the way it was looking before```

<img src="/screenshots/10-06-2019--css.png" width="400" alt="10-06-2019 css">

## Session 7
*🗓 W, Oct 9, 2019* <br>
*6AM-12:30PM (5h30min + 1h break)

Starting to prepare my project so I can install the routers for different pages.

```Commit: #7 migrated the majority of code to StudyScreen.js and installed react-router-dom```

```Commit: #7 Search screen is complete. ```

```Commit: #7 added Search component to the study screen. Decided am going to remove SearchScreen in the future```

<img src="/screenshots/10-09-2019--1.png" width="300" alt="10-09-2019--1">
<img src="/screenshots/10-09-2019--2.png" width="300" alt="10-09-2019--2">
<img src="/screenshots/10-09-2019--3.png" width="300" alt="10-09-2019--3">
<img src="/screenshots/10-09-2019--4.png" width="300" alt="10-09-2019--4">