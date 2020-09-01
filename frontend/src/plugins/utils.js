import { changeSelection } from '@/utils/arrayUtils.js'
import { formatStringDate } from '@/utils/dateUtils.js'

const Utils = {
  install (Vue, options) {
    Vue.prototype.$changeSelection = changeSelection
    Vue.prototype.$formatDate = function (dateString, addTime) {
      return formatStringDate(dateString, addTime)
    }
  }
}
export default Utils
