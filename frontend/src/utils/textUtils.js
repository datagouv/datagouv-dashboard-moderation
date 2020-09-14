export function trimText (text, max) {
  let newText = text
  if (newText.length > max) {
    newText = `${newText.substring(0, max)} [...]`
  }
  return newText
}
