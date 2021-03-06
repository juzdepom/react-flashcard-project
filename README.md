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
Last time I updated this README I mentioned that I wanted to build the <strong>React Native application</strong>. Well instead I decided to build the app in <strong>Swift</strong> and spent two days building it out on my old macbook <strong>which then crashed lol</strong>. For now will be keeping the app as a Web app.
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
🕐 6AM-12:50PM (5h50min + 1h break)

Starting to prepare project for Router installation.

```Commit: #7 migrated the majority of code to StudyScreen.js and installed react-router-dom```

```Commit: #7 Search screen is complete. ```

```Commit: #7 added Search component to the study screen. Decided am going to remove SearchScreen in the future```

<img src="/screenshots/10-09-2019--1.png" width="300" alt="10-09-2019--1">
React Router installed successfully. Creating a separate screen.
<img src="/screenshots/10-09-2019--2.png" width="300" alt="10-09-2019--2">
Formatting
<img src="/screenshots/10-09-2019--3.png" width="300" alt="10-09-2019--3">
Finished but having trouble figuring out how to easily renavigate back to StudyScreen while passing one of the Flashcards as props.
<img src="/screenshots/10-09-2019--4.png" width="300" alt="10-09-2019--4">
Decided finally to just incorporate code I wrote for SearchScreen directly into StudyScreen to reduce the number the steps the user has to go through to Search. 
<br/>
Potential future todos: <br/>
◻️ get font awesome installed and create custom button components with fontawesome <br/>
◻️ add ability to see list of cards in each deck <br/>
◻️ create "progress screen and log points earned for each day" <br/>

## Session 8
*🗓 Th, Oct 10, 2019* <br>
🕐 5:30AM-7:08AM (Total: 1h38min = 1h24min + 14min break) 

```Commit: #8 Building out a bunch of components. Build out the DeckList component the most. Still a work in progress.```

<img src="/screenshots/10-10-2019--decklist.gif" width="400" alt="10-10-2019 decklist">

## Session 9
*🗓 S, Oct 11, 2019* <br>
🕐 6:40AM-3:30PM

``` Commit: #9 updated addflashcards component a bit```<br>
``` Commit: #9 convered Card.css to Card.scss```<br>
``` Commit: #9 when flipping card, reveals Thai characters first, then reveals pronunciation```<br>
``` Commit: #9 Finished Progress Component```<br>

<img src="/screenshots/10-11-2019.png" width="400" alt="10-11-2019">

## Session 10
*🗓 Su, Oct 13, 2019* <br>

```Commit: #10 disabled keyboard when progress log is open```<br>
```Commit: #10 more Progress component work```<br>

## Session 11
*🗓 Tu, Oct 15, 2019* <br>

```#11 npm install react moment```<br>
```#11 moment is not working so I just wrote my own script```<br>
```#11 moved convertDate method to an external methods file```<br>
```#11 successfully displaying estimated date of mastery```<br>
```#11 retroactively added unique ids to previous flashcards and wrote code to add a new unique id to each new flashcard```<br>

<img src="/screenshots/10-15-2019--date.png" width="400" alt="10-15-2019--date">

## Session 12
*🗓 W, Oct 16, 2019* <br>

```#12 Making progress on DeckList component``` <br>
```#12 version one of DeckList component is complete``` <br>

Version 1
<img src="/screenshots/10-16-2019--decklist-1.png" width="400" alt="">
Version 2
<img src="/screenshots/10-16-2019--decklist-2.png" width="400" alt="">
Final Version
<img src="/screenshots/10-16-2019--decklist-3.png" width="400" alt="">

## Session 13
*🗓 Th, Oct 17, 2019* <br>

```#13 created TimeLogger``` <br>

<img src="/screenshots/10-17-2019--timelog.png" width="400" alt="">
<img src="/screenshots/10-17-2019--timelog.gif" width="400" alt="">

## Session 14
*🗓 F, Oct 18, 2019* <br>

```#14 successfully migrated 'timelogs' data to a separate Firebase backend project.```<br>

<img src="/screenshots/10-18-2019--new-backend.png" width="400" alt="new backend">

```#14 added the total exp points earned today to main flashcard page for self motivation.```<br>

<img src="/screenshots/10-18-2019--exp.png" width="400" alt="exp">

```#14 updated DeckList card appearance and changed how cards are selected from specific decks```<br>

Now am relying a lot less on master deck indexes and more on IDs (although I should definitely change how the IDs are created)
Now when clicking on the "specific deck" button, right hand side, does not pick a random card from that deck but the card that you haven't looked at for the longest time (e.g. 2 days ago)

```#14 updated code for how cards are randomly picked```<br>
```#14 added link to timely database in firebase on timelog screen```<br>
```#14 made a lot of progress on TimeLogger; added a backup timelogger data json file to folder```<br>

<img src="/screenshots/10-18-2019--timelogger.png" width="700" alt="timelogger">

## Session 15
*🗓 S, Oct 19, 2019* <br>

Took longer than expect but ```#15 successfully installed font-awesome into project```<br>

<img src="/screenshots/10-19-2019--font-awesome.png" width="100" alt="">

```#15 correcting method errors in TimeLog```

```#15 navigating between entries is now possible!```

<img src="/screenshots/10-19-2019--nav.gif" width="500" alt="">

```#15 hashtag data is now showing correctly!```

<img src="/screenshots/10-19-2019--hashtag-data.png" width="400" alt="">

```#15 changed card so that thai characters appear first if card rating is 4 or 5```

## Session 16
*🗓 Su, Oct 20, 2019* <br>

```#16 made the hashtag data display more robust```

<img src="/screenshots/10-20-2019--hashtag-data.gif" width="600" alt="">

```#16 added more data to visibly assess in timelog```

<img src="/screenshots/10-20-2019--time-data.png" width="400" alt="">

#16 created version 1 of the all entries component! This will allow me to see all my time logs in one place! See GIF below

<img src="/screenshots/10-20-2019--all-entries.gif" width="600" alt="">

## Session 17
*🗓 M, Oct 21, 2019* <br>

#17 added objectives of the day to Timelogs! See GIF below

<img src="/screenshots/10-21-2019--objectives.gif" width="600" alt="">

#17 fixed the textinput which was having some height issues and added some small improvements to the timelog buttons!

## Session 18
*🗓 Th, Oct 24, 2019* <br>
Feeling a little bit frustrated. For some reason, my firebase database is no longer saving the most recent version of my flashcard studying data. My whole study session so far was deleted today!

#18 added a delayed method that resets the decklistcard key state.
#18 backing up flashcard data

## Session 19
*🗓 Tu, Oct 29, 2019* <br>
Cleaned up all of the errors that were showing up in the console!

## Session 20
*🗓 W, Oct 30, 2019* <br>
Added a habits parser to the timelogs project!

## Session 21
*🗓 Th, Oct 31, 2019* <br>

## Session 22
*🗓 Su, Nov 3, 2019* <br>
Oops, it's been a while since I committed. Anyways, made a ton of progress on the #clientwork analysis portion of my timelogs. Really like the concept of putting all the logic in one component, displaying all the data in a separate component 

## Session 23
*🗓 Th, Nov 7, 2019* <br>
For the time logger project, created a bunch of text parser components.

## Session 24
*🗓 Sat, Nov 9, 2019* <br>
Timelog, reformatted entries replace l&&l and igf&&igf with emojies

## Session 25
*🗓 Sat, Nov 9, 2019* <br>
Created initial versions of the text parser.

## Session 26
*🗓 Su, Nov 10, 2019* <br>
Made progress on the text parsers!
Created an initial version of the vision board!

It's been awhile since we've done an update gif so here it is!
<img src="/screenshots/10-11-2019--progress.gif" width="600" alt="">

## Session 27
*🗓 Mon, Nov 11, 2019* <br>
Some small updates to the text parser components


## Session 28
*🗓 Tu, Nov 19, 2019* <br>
Some small updates to the text parser components

## Session 29
*🗓 Th, Nov 21, 2019* <br>
#29 changes to vision board and to cell colors

## Session 30
*🗓 Su, Nov 24, 2019* <br>
<strong>Working on the Timelog project</strong>
#30 hide a portion of the current time component and only make it appear when the time component is tapped. Currently it is taking too much space
#30 figured out how to incorporate a "did you complain" in a way that meshes well with the project aka 'interactive self development journal' (ISDJ?) -> a new temporary name over the old name 'timelog'
--> make progress on the ParsedTextDetailsComponent.
