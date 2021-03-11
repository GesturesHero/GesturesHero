# GesturesHero

## Pitch

The game where your hands are your instruments!
GesturesHero is a game where the player is challenged to interpret several music excerpts, not with an instrument, but with a sequence of gestures like a gestural dance.
The player starts as a beginner until reaching the level of an orchestra conductor.
Clocked by the rhythm of the music, he must reproduce in a correct way the gesture that appears on the screen within allotted time.
Only three wrong notes are tolerated.
Beyond these failures, the player must restart his interpretation.
In case of success, the player can start the next level.
Each level is characterized by its difficulty (new gestures, gestures layout more elaborated, higher rhythm and longer songs).
The player’s goal is to complete all the levels and to reach the end of the game to become, as quick as possible, the best orchestra conductor.

To sum up, the game can be compared to the famous [Guitar Hero](https://en.wikipedia.org/wiki/Guitar_Hero) game (developed by Harmonix Music System) but where the guitar device was replaced by the player’s hands, hence the name: GesturesHero.

<img src="assets/img/logo.svg" width="150px" alt="GesturesHero's logo"/>

## History
The game has been developed from October to December 2020.

## Authors

* ANDRÉ Maxime ([@mxmadr](https://github.com/mxmadr))
* BAYET Anthony ([@abayet](https://github.com/abayet))
* JETZEN Tobias ([@tjetzen](https://github.com/tjetzen))
* LUYCX Pierre ([@tarhses](https://github.com/tarhses))

## Getting started

### Prerequisite
The game requires :
- A web browser (Google Chrome, Mozilla Firefox, ...).
- A [LeapMotion Controller](https://www.ultraleap.com/product/leap-motion-controller/) device. We used the one with the "Model No" "LM-010".
- [Node JS](https://nodejs.org/en/).

### Common

- Open the project in an IDE (Web Storm, PhpStorm, Visual Studio Code, etc.).
- Install the dependencies.
```sh
npm install
```

### While development

- Start the server.

NOTE : The "dev" mode avoid caching and reload all the files on each request.

```sh
npm run start-dev
```

### While production

- Start the server.

```sh
npm run start
```

## Technologies
* HTML5 & CSS3
* JavaScript
* LeapMotion and related

## Libraries
* [MomentJS](https://momentjs.com/)
* [Bootstrap](https://getbootstrap.com/)
* [JQuery](https://code.jquery.com/jquery-3.1.0.js)
* [Bootstrap Icons](https://icons.getbootstrap.com/)
* [Leap](https://developer-archive.leapmotion.com/javascript)
* [Rigged Hands](https://github.com/leapmotion/leapjs-rigged-hand)
* [Three.js](https://threejs.org/)
* [sirv](https://www.npmjs.com/package/sirv)
* [sirv-cli](https://www.npmjs.com/package/sirv-cli)

## Tools
* [npm](https://www.npmjs.com/) is the package manager we used.
* The gestures has been recorded via [Leap Recorder](http://leapmotion.github.io/leapjs-playback/recorder/) and saved in GIF via [ScreenToGif](https://www.screentogif.com/).
* The music has been cropped via [Audacity](https://audacity.fr/).

Special thanks to their designers for making them available freely.

## Musics
Disclaimer : The rights belong to the authors of the musics.
* [Wii - Mii Channel Theme](https://youtu.be/po-0n1BKW2w)
* [John Williams - Cantina Band](https://youtu.beEsvfptdFXf4)
* [C2C - F.U.Y.A](https://youtu.be/1KOaT1vdLmc)
* [C2C - Down The Road](https://youtu.be/k1uUIJPD0Nk)
* [Timmy Trumpet x Vengaboys - Up & Down](https://youtu.be/SBDCd_lD6hI)
* [Armin van Buuren - Blah Blah Blah](https://youtu.be/mfJhMfOPWdE)
* [Stromae - Merci](https://youtu.be/2qfm71JSaXA)
* [OneRepublic - Wherever I Go](https://youtu.be/OXWrjWDQh7Q)
* [The White Stripes - Black Math](https://youtu.be/-VfnSZt-5pw)
