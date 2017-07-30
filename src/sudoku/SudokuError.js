
export default class SudokuError {

  /**
   * @param {number} x The x-coordinate (column) of the error
   * @param {number} y The y-coordinate (row) of the error
   * @return {Array<Conflict>} conflicts All the squares this error has conflicts with.
   */
  constructor(x, y, conflicts) {
    this.x = x;
    this.y = y;
    this.conflicts = conflicts;
  }

  /**
   * Returns whether this error square has a conflict at the passed coordinates.
   *
   * @param {number} row The row to check
   * @param {number} column The column to check
   * @return {boolean} True if this error has a conflict at the passed coordinates
   */
  hasConflict(row, column) {
    for (let conflict of this.conflicts) {
      if (conflict.x === row && conflict.y === column) {
        return true;
      }
    }
    return false;
  }

  equals(other) {
    if (other == null) {
      return false;
    }

    if (this.x !== other.x || this.y !== other.y) {
      return false;
    }

    if (this.conflicts.length !== other.conflicts.length) {
      return false;
    }

    for (let i = 0; i < this.conflicts.length; i++) {
      //hmmm... can we really rely on order here.
      if (!this.conflicts[i].equals(other.conflicts[i])) {
        return false;
      }
    }
    return true;
  }
}