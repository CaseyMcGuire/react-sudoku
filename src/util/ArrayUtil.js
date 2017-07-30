

export function deepCopyArray(array) {
  return array.map((value) => {
    if (value instanceof Array) {
      return deepCopyArray(value);
    } else {
      return value;
    }
  })
}