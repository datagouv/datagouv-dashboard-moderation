import { formatStringDate } from '@/utils/dateUtils.js'

const Formats = {
  install (Vue, options) {
    Vue.prototype.$formatDate = function (dateString, addTime) {
      return formatStringDate(dateString, addTime)
    }
  }
}
export default Formats
