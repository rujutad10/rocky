const states = {
    IDLE: "idle",
    WALKING: "walking",
    TALKING: "talking",
    CELEBRATING: "celebrating"
};

const events = {
    DESKTOP: "desktop",
    VSCODE: "vscode",
    GIT: "git",
    LOW_BATTERY: "battery-low",

    WALK_COMPLETE: "walk_complete",
    TALK_COMPLETE: "talk_complete",
    CELEBRATE_COMPLETE: "celebrate_complete"
};
class StateMachine {

    constructor(controller) {

        this.state = states.IDLE;
        this.previousState = null;

        this.ctrl = controller;
        this.talkReason = null;
    }

    transition(newState) {

        if (this.state === newState)
            return;

        this.exitstate(this.state);

        this.previousState = this.state;
        this.state = newState;

        console.log(
            `Transition: ${this.previousState} -> ${this.state}`
        );

        this.enterstate(this.state);
    }

   enterstate(state) {

    switch (state) {

        case states.IDLE:

            this.ctrl.idle();
            break;

        case states.WALKING:

            this.ctrl.startwalking();
            break;

        case states.TALKING:

            if (this.talkReason === "vscode") {
                this.ctrl.showbubble("vscode");
            }
            else if (this.talkReason === "battery") {
                this.ctrl.showbubble("battery");
            }

            break;

        case states.CELEBRATING:

            this.ctrl.startcelebrating();
            break;
    }
}
    exitstate(state) {

        switch (state) {

            case states.WALKING:
                this.ctrl.stopwalking();
                break;

            case states.TALKING:
                this.ctrl.stoptalking();
                break;

            case states.CELEBRATING:
                this.ctrl.stopcelebrating();
                break;
        }
    }

    handleEvent(event) {

        switch (this.state) {

            case states.IDLE:

                if (event === events.DESKTOP) {
                    this.transition(states.WALKING);
                }

                else if (event === events.VSCODE) {
                    this.talkReason = "vscode";
                    this.transition(states.TALKING);
                }

                else if (event === events.GIT) {
                    this.transition(states.CELEBRATING);
                }

                else if (event === events.LOW_BATTERY) {
                    this.talkReason = "battery";
                    this.transition(states.TALKING);
                }

                break;

            case states.WALKING:

                if (event === events.WALK_COMPLETE) {
                    this.transition(states.IDLE);
                }

                else if (event === events.VSCODE) {
                    this.talkReason = "vscode";
                    this.transition(states.TALKING);
                }

                else if (event === events.GIT) {
                    this.transition(states.CELEBRATING);
                }

                else if (event === events.LOW_BATTERY) {
                    this.talkReason = "battery";
                    this.transition(states.TALKING);
                }

                break;

            case states.TALKING:

                if (event === events.TALK_COMPLETE) {
                    this.transition(states.IDLE);
                }

                else if (event === events.DESKTOP) {
                    this.transition(states.WALKING);
                }

                else if (event === events.GIT) {
                    this.transition(states.CELEBRATING);
                }

                else if (event === events.VSCODE) {
                    this.talkReason = "vscode";
                }

                else if (event === events.LOW_BATTERY) {
                    this.talkReason = "battery";
                }

                break;

            case states.CELEBRATING:

                if (event === events.CELEBRATE_COMPLETE) {
                    this.transition(states.IDLE);
                }

                else if (event === events.LOW_BATTERY) {
                    this.talkReason = "battery";
                    this.transition(states.TALKING);
                }

                break;
        }
    }
}

module.exports = {
    StateMachine,
    states,
    events
};