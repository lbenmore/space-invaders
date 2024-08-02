export default class Missile {
    constructor(player) {
        this.player = player;

        this.speed = 5;
        this.elements = {};

        this.advance = this.advance.bind(this);

        this.init();
    }

    destroy() {
        const { activeMissiles } = this.player.battlefield;
        const missileIndex = activeMissiles?.indexOf(this);

        cancelAnimationFrame(this.currentFrame);
        this.detachListeners();

        missileIndex && this.player.battlefield.activeMissiles.splice(missileIndex, 1);

        for (const el in this.elements) {
            this.elements[el].parentNode.removeChild(this.elements[el]);
        }

        this.speed = null;
        this.elements = null;
    }

    missCheck() {
        return new Promise((resolve) => {
            const { top: missileTop, height: missileHeight } = this.elements.container.getBoundingClientRect();

            if (missileTop <= missileHeight * -1) {
                this.destroy();
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    hitCheck() {
        return new Promise((resolve) => {
            const { squads } = this.player.battlefield.platoon;
            const { x, y, width: w } = this.elements.container.getBoundingClientRect();

            squads.forEach((squad) => {
                const { top: squadTop, height: squadHeight } = squad.elements.container.getBoundingClientRect();

                if (squadTop + squadHeight >= y) {
                    const { soldiers } = squad;

                    soldiers.forEach((soldier) => {
                        const { left: soldierLeft, width: soldierWidth } = soldier.elements.container.getBoundingClientRect();
                        const soldierHealth = soldier.health;
                        const soldierRight = soldierLeft + soldierWidth;

                        if (soldierHealth > 0 && soldierLeft <= x && x + w <= soldierRight) {
                            soldier.hit();
                            this.destroy();
                            resolve(true);
                        }
                    });
                }
            });

            resolve(false);
        });
    }

    advance() {
        if (this.player.battlefield.paused) return;

        const { top: missileTop } = this.elements.container.getBoundingClientRect();
        this.elements.container.style.top = `${missileTop - (this.speed * 1)}px`;

        this.hitCheck()
            .then((result) => {
                !result && this.missCheck()
                    .then((result) => {
                        !result && (this.currentFrame = requestAnimationFrame(this.advance));
                    })
            });
    }

    initAnim() {
        requestAnimationFrame(() => {
            this.advance();
        });
    }

    stylize() {
        const {
            width: battlefieldWidth,
            height: battlefieldHeight
        } = this.player.battlefield.target.getBoundingClientRect();
        const {
            left: playerLeft,
            width: playerWidth,
            height: playerHeight
        } = this.player.elements.container.getBoundingClientRect();

        const missileWidth = battlefieldWidth * 0.02;
        const missileHeight = battlefieldHeight * 0.1;
        const missileLeft = playerLeft + (playerWidth / 2) - (missileWidth / 2);
        const missileBottom = (battlefieldHeight * 0.05) + playerHeight + (battlefieldHeight * 0.01);

        Object.assign(this.elements.container.style, {
            bottom: `${missileBottom}px`,
            left: `${missileLeft}px`,
            width: `${missileWidth}px`,
            height: `${missileHeight}px`,
        });

    }

    decorate() {
        this.elements.container.classList.add('missile');
    }

    detachListeners() {
        this.player.battlefield.target.removeEventListener('play', this.advance);
    }

    attachListeners() {
        this.player.battlefield.target.addEventListener('play', this.advance);
    }

    populate() {
        this.elements.container = document.createElement('div');
    }

    init() {
        this.populate();
        this.attachListeners();
        this.decorate();
        this.stylize();
        this.initAnim();
    }
}
