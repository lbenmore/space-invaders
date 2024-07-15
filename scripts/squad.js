import Soldier from './soldier.js';

export default class Squad {
  constructor(platoon, numSoldiers = 6) {
      this.platoon = platoon;
      this.elements = {};
      this.soldiers = Array(numSoldiers).fill('');
      this.health = numSoldiers;

      this.init();
  }

  destroy() {
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

  decorate() {
      this.elements.container.classList.add('squad');
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
      this.decorate();
  }
}
