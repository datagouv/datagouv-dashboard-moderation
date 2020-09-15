import { APIresponses } from '@/config/APIoperations.js'

export async function makeResponseToast (resp, itemId = '', method = 'GET', dgfType = 'dataset') {
  console.log('-P- makeResponseToast > resp : ', resp)
  const h = this.$createElement
  // const variant = resp.status && APIresponses.success.includes(resp.status) ? 'success' : 'danger'
  // const title = resp.status && APIresponses.success.includes(resp.status) ? 'success' : 'error'
  // const msg = resp.status && APIresponses.success.includes(resp.status) ? 'ok msg' : this.$t('toastsModeration.errorTxt', { code: resp.status })
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
      // h('strong', msg)
      h('strong', `GET ${dgfType}`),
      h('br'),
      h('span', `id : ${itemId}`), h('hr'),
      h('strong', msg), h('br'),
      h('p', this.$t(`responseCodes._${resp.status}`))
    ]
  )
  console.log('-P- makeResponseToast > vNodesTitle : ', vNodesTitle)

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
