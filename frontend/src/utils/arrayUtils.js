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

export function toggleSelectAll (selection, items) {
  let selectAllStatus
  if (selection.length > 0) {
    selection = []
    selectAllStatus = false
  } else {
    selection = items.map(item => item.id)
    selectAllStatus = true
  }
  return [selection, selectAllStatus]
}
