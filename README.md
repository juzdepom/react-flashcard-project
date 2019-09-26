## Session 1
*🗓 Th, Sep 26, 2019* <br>

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
