import PickTheSymbolsBlank from './h5p-pick-the-symbols-blank';

/** Class representing a group of blanks */
export default class PickTheSymbolsBlankGroup {
  /**
   * @constructor
   *
   * @param {object} params Parameters.
   */
  constructor(params) {
    this.params = params;

    this.params.callbacks = this.params.callbacks || {};
    this.params.callbacks.onOpenOverlay = this.params.callbacks.onOpenOverlay || (() => {});

    this.blanks = [];

    this.content = document.createElement('div');
    this.content.classList.add('h5p-pick-the-symbols-blank-group');
  }

  /**
   * Return the DOM for this class.
   * @return {HTMLElement} DOM for this class.
   */
  getDOM() {
    return this.content;
  }

  /**
   * Add blank to the end of the group.
   */
  addBlank() {
    const blank = new PickTheSymbolsBlank({
      callbacks: {
        onClick: (blank) => {
          this.handleOpenOverlay(blank);
        }
      },
      color: this.params.colorBackground,
      solution: this.params.solution.slice(this.blanks.length, this.blanks.length + 1),
    });

    this.blanks.push(blank);
    this.content.appendChild(blank.getDOM());
  }

  /**
   * Remove last blank from the group.
   */
  removeBlank() {
    if (this.blanks.length < 2) {
      return;
    }

    this.content.removeChild(this.getBlank(Infinity).getDOM());
    this.blanks.splice(-1);
  }

  /**
   * Get blank.
   * @param {number} [index=Infinity] Index of blank.
   * @return {PickTheSymbolsBlank} Blank.
   */
  getBlank(index = Infinity) {
    index = Math.min(Math.max(0, index), this.blanks.length - 1);
    return this.blanks[index];
  }

  /**
   * Handle opening overlay by blank.
   * @param {PickTheSymbolsBlank} Blank.
   */
  handleOpenOverlay(blank) {
    this.params.callbacks.onOpenOverlay(this, blank);
  }

  /**
   * Get maximum score for group.
   * @return {number} Maximum score for group.
   */
  getMaxScore() {
    return this.blanks.filter(blank => {
      return (this.params.solution.indexOf(blank.getSolution()) !== -1);
    }).length;
  }

  /**
   * Get score for group.
   * @return {number} Score for group.
   */
  getScore() {
    const score = this.blanks.reduce((score, blank) => score + blank.getScore(), 0);
    return Math.max(0, score);
  }

  /**
   * Mark visual state of blanks.
   * @param {object} [params={}] Parameters.
   * @param {boolean} [params.highlight] If true, mark state, else reset.
   * @param {boolean} [params.answer] If true, show answer, else hide.
   */
  showSolutions(params = {}) {

    // Show all relevant blanks and only those
    if (params.answer) {
      while (this.blanks.length < this.params.solution.length) {
        this.addBlank();
      }

      while (this.blanks.length > this.params.solution.length) {
        if (this.getBlank(Infinity).getAnswer() !== null) {
          break; // Useless blank has been filled
        }
        this.removeBlank();
      }
    }

    this.blanks.forEach(blank => {
      blank.showSolution(params);
    });
  }

  /**
   * Reset blanks.
   */
  reset() {
    // Remove all obsolete blanks
    while (this.blanks.length > 1) {
      this.removeBlank();
    }

    this.blanks.forEach(blank => {
      blank.reset();
    });
  }
}
