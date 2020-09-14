export function changeSelection (arr, item) {
  let resultArray
  if (arr.includes(item)) {
    resultArray = arr.filter(el => {
      return el !== item
    })
  } else {
    resultArray = [...arr]
    resultArray.push(item)
  }
  return resultArray
}
