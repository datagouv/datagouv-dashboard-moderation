export default function getLocale ({ next, store, router }) {
  const prefixLocalStorage = process.env.VUE_APP_OAUTH_LS_PREFIX
  const prefixLocale = `${prefixLocalStorage}Locale`
  const localeFromLocalStorage = localStorage[prefixLocale]
  const localeFromStore = store.state.global.locale

  if (localeFromLocalStorage && localeFromStore !== localeFromLocalStorage) {
    store.dispatch('global/changeLocale', localeFromLocalStorage)
  }
  if (!localeFromLocalStorage) {
    store.commit('global/setLocaleInLocalStorage', localeFromStore)
  }
  return next()
}
