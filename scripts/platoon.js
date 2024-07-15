import Squad from './squad.js';

export default class Platoon {
  constructor(battlefield, numSquads = 4, numSoldiers = 6) {
      this.battlefield = battlefield;
      this.numSoldiers = numSoldiers;
      this.elements = {};
      this.squads = Array(numSquads).fill('');
      this.health = numSquads;

      this.init();
  }

  destroy() {
      this.squads.forEach(squad => squad.destroy());

      for (const el in this.elements) {
          this.elements[el].parentNode.removeChild(this.elements[el]);
      }

      this.squads = null;
      this.elements = null;
  }
  
  hit() {
      if (!--this.health) {
          this.battlefield.gameOver();
      }
  }

  decorate() {
      this.elements.container.classList.add('platoon');
  }

  populate() {
      this.elements.container = document.createElement('div');

      this.squads = this.squads.map(_ => new Squad(this, this.numSoldiers));
      
      this.squads.forEach(squad => {
          this.elements.container.appendChild(squad.elements.container);
      });
  }

  init() {
      this.populate();
      this.decorate();
  }
}
