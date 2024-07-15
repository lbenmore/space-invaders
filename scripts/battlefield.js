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

      this.init();
  }

  destroy() {
      this.player.destroy();
      this.platoon.destroy();
      this.activeMissiles.forEach(missile => missile.destroy());

      this.player = null;
      this.platoon = null;
      this.activeMissiles = [];
  }
  
  gameOver() {
      this.destroy();

      if (confirm('game over')) {
          this.init();
      }
  }
  
  fire() {
      this.player.fire();
  }

  attachListeners() {
      this.fire = this.fire.bind(this);

      this.target.addEventListener('click', this.fire);
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
