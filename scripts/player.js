import Missile from './missile.js';

export default class Player {
    constructor(battlefield) {
        this.battlefield = battlefield;
        this.speed = battlefield.playerSpeed;
        this.elements = {};
        this.dir = 0;

        this.init();
    }

    destroy() {
        cancelAnimationFrame(this.currentFrame);
        this.detachListeners();

        for (const el in this.elements) {
            this.elements[el].parentNode.removeChild(this.elements[el]);
        }

        this.elements = null;
        this.dir = 0;
    }

    fire() {
        const newMissile = new Missile(this);

        this.battlefield.activeMissiles.push(newMissile);
        this.battlefield.target.appendChild(newMissile.elements.container);
    }

    dencrementSweep() {
        if (this.battlefield.paused) return;

        const { left: playerLeft, width: playerWidth } = this.elements.container.getBoundingClientRect();
        const { width: battlefieldWidth } = this.battlefield.target.getBoundingClientRect();

        if (
            this.dir > 0 && playerLeft + playerWidth < battlefieldWidth ||
            this.dir < 0 && playerLeft > 0
        ) {
            this.elements.container.style.left = `${playerLeft + (this.speed * this.dir)}px`;
        } else if (this.dir > 0 && playerLeft + playerWidth >= battlefieldWidth) {
            this.dir = -1;
        } else if (this.dir < 0 && playerLeft <= 0) {
            this.dir = 1;
        }

        this.currentFrame = requestAnimationFrame(this.dencrementSweep.bind(this));
    }

    initAnim() {
        this.currentFrame = requestAnimationFrame(() => {
            const dir = Math.round(Math.random()) ? 1 : -1;
            this.dir = dir;
            this.dencrementSweep();
        });
    }

    decorate() {
        this.elements.container.classList.add('player');
        this.elements.piece1.classList.add('piece', 'piece1');
        this.elements.piece2.classList.add('piece', 'piece2');
        this.elements.piece3.classList.add('piece', 'piece3');
        this.elements.piece4.classList.add('piece', 'piece4');
    }

    detachListeners() {
        this.battlefield.target.removeEventListener('play', this.dencrementSweep);
    }

    attachListeners() {
        this.dencrementSweep = this.dencrementSweep.bind(this);
        this.battlefield.target.addEventListener('play', this.dencrementSweep);
    }

    populate() {
        this.elements.container = document.createElement('div');
        this.elements.piece1 = document.createElement('span');
        this.elements.piece2 = document.createElement('span');
        this.elements.piece3 = document.createElement('span');
        this.elements.piece4 = document.createElement('span');

        this.elements.container.appendChild(this.elements.piece1);
        this.elements.container.appendChild(this.elements.piece2);
        this.elements.container.appendChild(this.elements.piece3);
        this.elements.container.appendChild(this.elements.piece4);
    }

    init() {
        this.populate();
        this.attachListeners();
        this.decorate();
        this.initAnim();
    }
}
