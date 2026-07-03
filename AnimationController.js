class AnimationController {
    constructor(rocky, bubble, ipcRenderer) {
        this.rocky = rocky;
        this.bubble = bubble;
        this.ipcRenderer = ipcRenderer;

        this.walkFrame = 0;
        this.jazzFrame = 0;

        this.walking = false;
        this.celebrating = false;
        this.hovering = false;

        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.availHeight;

        this.WINDOW_HEIGHT = 260;
        this.ROCKY_WIDTH = 160;

        this.baseY = this.screenHeight - this.WINDOW_HEIGHT;
        this.y = this.baseY;

        this.x = 2;
        this.speed = 2;
        this.bounce = 0;

        this.walkFrames = [
            "assets/walk1.png",
            "assets/walk2.png"
        ];

        this.jazzFrames = [
            "assets/jazz1.png",
            "assets/jazz2.png"
        ];

        this.ballFrame = "assets/ball.png";

        this.bubbleFrames = {
            vscode: "assets/science.png",
            battery: "assets/encouragement.png"
        };

        this.walkFinished = null;
        this.talkFinished = null;
        this.celebrateFinished = null;

        this.talkTimer = null;
        this.celebrateTimer = null;

        this.rocky.addEventListener("mouseenter", () => {
            this.hovering = true;
        });

        this.rocky.addEventListener("mouseleave", () => {
            this.hovering = false;
        });

        this.startAnimationLoop();
        this.move();
    }

    idle() {
        this.walking = false;
        this.celebrating = false;

        clearTimeout(this.talkTimer);
        clearTimeout(this.celebrateTimer);

        this.rocky.src = this.ballFrame;
        this.hideBubble();
    }

    startwalking() {
        this.walking = true;
        this.celebrating = false;

        this.x = 2;
        this.y = this.baseY;
    }

    stopwalking() {
        this.walking = false;
        this.rocky.src = this.ballFrame;
    }

    startcelebrating() {
        clearTimeout(this.celebrateTimer);

        this.walking = false;
        this.celebrating = true;

        this.celebrateTimer = setTimeout(() => {
            this.celebrating = false;

            if (this.celebrateFinished) {
                this.celebrateFinished();
            }
        }, 2500);
    }

    stopcelebrating() {
        clearTimeout(this.celebrateTimer);
        this.celebrating = false;
    }

    showbubble(reason) {
        clearTimeout(this.talkTimer);

        if (!this.bubbleFrames[reason]) {
            console.warn(`Unknown bubble reason: ${reason}`);
            return;
        }

        this.bubble.src = this.bubbleFrames[reason];
        this.bubble.style.display = "block";

        this.talkTimer = setTimeout(() => {
            this.hideBubble();

            if (this.talkFinished) {
                this.talkFinished();
            }
        }, 3000);
    }

    hideBubble() {
        this.bubble.style.display = "none";
    }

    stoptalking() {
        clearTimeout(this.talkTimer);
        this.hideBubble();
    }

    onwalkingfinished(callback) {
        this.walkFinished = callback;
    }

    oncelebrationfinished(callback) {
        this.celebrateFinished = callback;
    }

    ontalkfinished(callback) {
        this.talkFinished = callback;
    }

    startAnimationLoop() {
        setInterval(() => {

            if (this.celebrating) {

                this.rocky.src = this.jazzFrames[this.jazzFrame];
                this.jazzFrame =
                    (this.jazzFrame + 1) % this.jazzFrames.length;

            }
            else if (this.walking) {

                this.rocky.src = this.walkFrames[this.walkFrame];
                this.walkFrame =
                    (this.walkFrame + 1) % this.walkFrames.length;

            }
            else {

                this.rocky.src = this.ballFrame;

            }

        }, 150);
    }

    move() {

        if (this.walking) {

            this.x += this.speed;
            this.y = this.baseY;

            if (this.x >= this.screenWidth - this.ROCKY_WIDTH) {

                this.x = this.screenWidth - this.ROCKY_WIDTH;
                this.walking = false;

                if (this.walkFinished) {
                    this.walkFinished();
                }
            }

        } else {

            this.x = 2;

            this.bounce += 0.08;

            this.y =
                this.baseY +
                Math.sin(this.bounce) * 3;
        }

        this.ipcRenderer.send(
            "move-rocky",
            this.x,
            this.y
        );

        requestAnimationFrame(() => this.move());
    }
}

module.exports = AnimationController;