export function formatStringDate (dateString, addTime = true) {
  const date = new Date(dateString)
  let month = date.getMonth() + 1
  month = month < 10 ? `0${month}` : `${month}`
  const euroDate = `${date.getDate()}/${month}/${date.getUTCFullYear()}`
  const time = `${date.getUTCHours()}h${date.getUTCMinutes()}`
  return `${euroDate}${addTime ? ' - ' + time : ''}`
}
