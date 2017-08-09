export default class Conflict {
  /**
   * @param {number} x The x-coordinate of the conflict.
   * @param {number} y The y-coordinate of the conflict.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    if (!(other instanceof Conflict)) {
      return false;
    }
    return this.x === other.x && this.y === other.y;
  }
}