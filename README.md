# Rocky

Rocky is a desktop companion built with Electron that responds to user activity through animations and contextual interactions. It uses a Finite State Machine (FSM) to manage behavior and state transitions.

## Features

* Walks across the screen when the desktop or File Explorer is active.
* Displays contextual speech bubbles while Visual Studio Code is active.
* Plays a celebration animation for specific events.
* Stays above the taskbar using an always-on-top transparent Electron window.

## Finite State Machine

Rocky's behavior is controlled using four states:

* **Idle** – Default bouncing animation.
* **Walking** – Triggered when the desktop or File Explorer is active.
* **Talking** – Displays contextual speech bubbles.
* **Celebrating** – Plays a celebration animation.

The FSM transitions between these states based on desktop events and animation completion events, ensuring that only one behavior is active at a time.

## Technologies

* Electron
* JavaScript
* Node.js

## Project Structure

```text
rocky/
├── assets/
├── AnimationController.js
├── StateMachine.js
├── renderer.js
├── main.js
├── index.html
└── package.json
```
