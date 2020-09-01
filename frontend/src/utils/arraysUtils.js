export function filterArray(arr, obj, key) {
  return arr.some(o => obj[key] === o[key]) ? // if you can find the object
    arr.filter(o => obj[key] !== o[key]) // remove it
    :
    [...arr, obj] // or add it if not
}
