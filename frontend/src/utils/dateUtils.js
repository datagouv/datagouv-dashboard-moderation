export function formatStringDate (dateString, addTime = true) {
  const date = new Date(dateString)
  const euroDate = `${date.getDate()}/${date.getMonth()}/${date.getUTCFullYear()}`
  const time = `${date.getUTCHours()}h${date.getUTCMinutes()}`
  return `${euroDate}${addTime ? ' - ' + time : ''}`
}
