import Soldier from './soldier.js';

export default class Squad {
    constructor(platoon, numSoldiers = 6) {
        this.platoon = platoon;
        this.elements = {};
        this.soldiers = Array(numSoldiers).fill('');
        this.health = numSoldiers;
        this.attackPosition = 0;
        this.attackAmount = 10;
        this.advanceDelay = 1000;
        this.dir = 0;

        this.dencrementSweep = this.dencrementSweep.bind(this);
        this.advance = this.advance.bind(this);

        this.init();
    }

    destroy() {
        cancelAnimationFrame(this.currentFrame);
        clearTimeout(this.advanceTimeout);
        this.detachListeners();

        this.soldiers.forEach(soldier => soldier.destroy());

        for (const el in this.elements) {
            this.elements[el].parentNode.removeChild(this.elements[el]);
        }

        this.soldiers = null;
        this.health = null;
    }

    hit() {
        if (!--this.health) {
            this.platoon.hit();
        }
    }

    hasHit() {
        return new Promise(resolve => {
            const { top, height } = this.elements.container.getBoundingClientRect();
            const bottom = top + height;
            const { top: playerTop } = this.platoon.battlefield.player.elements.container.getBoundingClientRect();

            if (bottom >= playerTop) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    async advance() {
        if (this.platoon.battlefield.paused) return;

        const health = this.soldiers.reduce((result, soldier) => {
            const soldierHealthVarValue = getComputedStyle(soldier.elements.container).getPropertyValue('--health');
            const soldierHealth = parseInt(soldierHealthVarValue);
            return result + soldierHealth;
        }, 0);

        if (!health) return;

        this.attackPosition += this.attackAmount;
        Object.assign(this.elements.container.style, {
            top: `${this.attackPosition}px`
        });

        if (await this.hasHit()) {
            this.platoon.battlefield.gameOver();
        } else {
            this.advanceTimeout = setTimeout(this.advance, this.advanceDelay);
        }
    }

    dencrementSweep() {
        if (this.platoon.battlefield.paused) return;

        const { width: squadWidth } = this.elements.container.getBoundingClientRect();
        const squadLeft = parseInt(getComputedStyle(this.elements.container).left);
        const threshold = squadWidth / 4;
        const speed = 2;

        if (
            (this.dir > 0 && squadLeft < threshold) ||
            (this.dir < 0 && squadLeft > threshold * -1)
        ) {
            this.elements.container.style.left = `${squadLeft + (speed * this.dir)}px`;
        } else {
            this.dir = this.dir === 1 ? -1 : 1;
        }

        this.currentFrame = requestAnimationFrame(this.dencrementSweep);
    }

    initAnim() {

        this.currentFrame = requestAnimationFrame(() => {
            const { width: squadWidth } = this.elements.container.getBoundingClientRect();
            const threshold = squadWidth / 4;
            const dir = this.platoon.squads.indexOf(this) % 2 === 0 ? 1 : -1;
            const left = `${Math.floor(Math.random() * threshold * dir)}px`;

            Object.assign(this.elements.container.style, { left });

            this.dir = dir;

            this.dencrementSweep();
            this.advanceTimeout = setTimeout(this.advance, this.advanceDelay);
        });
    }

    decorate() {
        this.elements.container.classList.add('squad');
    }

    detachListeners() {
        this.platoon.battlefield.target.removeEventListener('play', this.dencrementSweep);
        this.platoon.battlefield.target.removeEventListener('play', this.advance);
    }

    attachListeners() {
        this.platoon.battlefield.target.addEventListener('play', this.dencrementSweep);
        this.platoon.battlefield.target.addEventListener('play', this.advance);
    }

    populate() {
        this.elements.container = document.createElement('div');

        this.soldiers = this.soldiers.map(_ => new Soldier(this));

        this.soldiers.forEach(soldier => {
            this.elements.container.appendChild(soldier.elements.container);
        })
    }

    init() {
        this.populate();
        this.attachListeners();
        this.decorate();
        this.initAnim();
    }
}
