# Orish Reading Robot — Brain V0.1

This folder contains the first working software prototype for a physical Orish's World reading robot.

## Goal

Prove the core learning loop before buying robot hardware:

1. Show a simple word.
2. Let the child hear it and sound it out.
3. Listen only after the child presses **My turn**.
4. Recognise the attempted word when the browser supports speech recognition.
5. Respond kindly.
6. Never treat microphone uncertainty as proof that the child is wrong.
7. Save simple progress locally in the browser.
8. Move through a 10-word starter lesson.

Starter words:

`cat, sat, mat, hat, pat, pin, sit, tap, map, pan`

## Run it

Open `index.html` in a modern browser.

For microphone testing, serving the file from HTTPS or localhost is preferable because browser microphone features commonly require a secure context.

## Free-first design

There is no paid API and no analytics SDK in this prototype.

- Browser speech synthesis provides the robot voice when available.
- Browser speech recognition is used when supported.
- Progress is stored with browser localStorage.
- A grown-up test control lets us validate the lesson state machine if speech recognition is unavailable.

## Important boundary

This is a prototype, not production child-data infrastructure.

- Do not enter sensitive child information.
- The microphone is activated only by a button press.
- The UI visibly shows when listening is active.
- A production version should use explicit adult account controls, stronger storage boundaries and, ideally, on-device/offline speech recognition on the robot hardware.

## Next engineering step

After this flow is tested, move the recognition layer to Raspberry Pi using an offline speech model, then connect physical buttons, a speaker, status LEDs and optional servos without changing the lesson engine.
