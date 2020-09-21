import { APIresponses } from '@/config/APIoperations.js'

export async function makeResponseToast (resp, itemId = '', method = 'GET', dgfType = 'dataset', field = '') {
  const h = this.$createElement
  const variant = !APIresponses.success.includes(resp.status) ? 'danger' : 'success'
  const title = !APIresponses.success.includes(resp.status) ? 'error' : 'success'
  const msg = !APIresponses.success.includes(resp.status) ? this.$t('toastsModeration.errorTxt', { code: resp.status }) : this.$t(`toastsModeration.successTxt_${method}`)

  const vNodesTitle = h(
    'div',
    { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'ml-2'] },
    [
      h('strong', { class: ['mr-2', 'text-center'] }, this.$t(`toastsModeration.${title}`))
    ]
  )
  const vNodesMsg = h(
    'p',
    { class: ['text-center', 'my-2'] },
    [
      h('strong', `${method} ${dgfType}`),
      h('br'), h('span', `${this.$t('moderation.field')} : ${field}`),
      h('br'), h('span', `id : ${itemId}`),
      h('hr'),
      h('strong', msg),
      h('br'), h('p', this.$t(`responseCodes._${resp.status}`))
    ]
  )

  this.$bvToast.toast([vNodesMsg], {
    title: [vNodesTitle],
    variant: variant,
    solid: true
  })
}

const MakeRespToast = {
  install (Vue, options) {
    Vue.prototype.$makeToast = makeResponseToast
  }
}
export default MakeRespToast
