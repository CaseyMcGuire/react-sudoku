export default class Errors {
  constructor() {
    this.errors = [];
  }

  add(error) {
    this.errors.push(error)
  }

  hasError(x, y) {
    return this.getError(x, y) !== null;
  }

  getError(x, y) {
    for (let error of this.errors) {
      if (error.x === x && error.y === y) {
        return error;
      }
    }
    return null;
  }

  equals(other) {
    if (this.errors.length !== other.errors.length) {
      return false;
    }
    for (let i = 0; i < this.errors.length; i++) {
      if (!this.errors[i].equals(other.errors[i])) {
        return false;
      }
    }
    return true;
  }
}