import Player from './player.js';
import Platoon from './platoon.js';

export default class Battlefield {
    constructor(target, options) {
        const defaultOptions = {
            squads: 4,
            soldiers: 6,
            playerSpeed: 3
        };

        const opts = Object.assign(defaultOptions, options);

        this.target = target;
        this.numSquads = opts.squads;
        this.numSoldiers = opts.soldiers;
        this.playerSpeed = opts.playerSpeed;

        this.player = null;
        this.platoon = null;
        this.activeMissiles = [];
        this.paused = false;

        this.fire = this.fire.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.init();
    }

    destroy() {
        this.player.destroy();
        this.platoon.destroy();
        this.activeMissiles.forEach(missile => missile.destroy());
        this.detachListeners();

        this.player = null;
        this.platoon = null;
        this.activeMissiles = [];
        this.paused = false;
    }

    gameOver() {
        this.destroy();

        if (confirm('game over')) {
            this.init();
        }
    }

    fire() {
        if (this.paused) return;
        this.player.fire();
    }

    onKeyPress(evt) {
        const { code } = evt;

        switch (code) {
            case 'Space':
                this.paused = !this.paused;
                this.target.dispatchEvent(new CustomEvent(this.paused ? 'pause' : 'play'));
                break;

            default: // do nothing
        }
    }

    detachListeners() {
        this.target.removeEventListener('click', this.fire);
        removeEventListener('keypress', this.onKeyPress);
    }

    attachListeners() {
        this.target.addEventListener('click', this.fire);
        addEventListener('keypress', this.onKeyPress);
    }

    populate() {
        this.player = new Player(this);
        this.platoon = new Platoon(this, this.numSquads, this.numSoldiers);

        this.target.appendChild(this.platoon.elements.container);
        this.target.appendChild(this.player.elements.container);
    }

    init() {
        this.target.style.setProperty('--squads', this.numSquads);
        this.target.style.setProperty('--soldiers', this.numSoldiers);

        this.populate();
        this.attachListeners();
    }
}
