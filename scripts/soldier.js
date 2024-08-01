export default class Soldier {
    constructor(squad) {
        this.squad = squad;
        this.elements = {};
        this.health = null;

        this.init();
    }

    destroy() {
        for (const el in this.elements) {
            this.elements[el].parentNode.removeChild(this.elements[el]);
        }

        this.elements = null;
        this.health = null;
    }

    hit() {
        this.elements.container.style.setProperty('--health', --this.health);

        if (!this.health) {
            this.squad.hit();
        }
    }

    readCssVariables() {
        requestAnimationFrame(() => {
            const cssHealth = getComputedStyle(this.elements.container).getPropertyValue('--health');
            this.health = parseInt(cssHealth);
        });
    }

    decorate() {
        this.elements.container.classList.add('soldier');
        this.elements.pieces.forEach((piece, i) => piece.classList.add('piece', `piece${i + 1}`));
    }

    populate() {
        this.elements.container = document.createElement('div');
        this.elements.pieces = Array(8).fill('').map(_ => document.createElement('div'));

        this.elements.pieces.forEach(piece => {
            this.elements.container.appendChild(piece);
        });
    }

    init() {
        this.populate();
        this.decorate();
        this.readCssVariables();
    }
}
