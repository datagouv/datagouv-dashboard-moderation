export default function checkAuth ({ next, store, from, to, router }) {
  // console.log('\n>>> MW > checkAuth > ... ')
  // console.log('>>> MW > checkAuth > to : ', to)
  // console.log('>>> MW > checkAuth > from : ', from)
  // console.log('>>> MW > checkAuth > router : ', router)

  // const defaultRedirect = process.env.VUE_APP_OAUTH_AUTHORIZE || '/authenticate'
  const defaultRedirect = '/reset-auth-api-client'

  const prefixLocalStorage = process.env.VUE_APP_OAUTH_LS_PREFIX
  const oauthAccessTokenName = `${prefixLocalStorage}AccessToken`
  const oauthRefreshTokenName = `${prefixLocalStorage}RefreshToken`
  const oauthExpiresName = `${prefixLocalStorage}Expires`
  const oauthTokenTypeName = `${prefixLocalStorage}TokenType`

  // console.log('>>> MW > checkAuth > localStorage : ', localStorage)
  const oauthAccessTokenFromLocalStorage = localStorage[oauthAccessTokenName]
  // console.log('>>> MW > checkAuth > oauthTokenFromLocalStorage : ', oauthAccessTokenFromLocalStorage)

  const oauthStoreAccessToken = store.state.oauth.tokens.access.value
  // console.log('>>> MW > checkAuth > oauthStoreAccessToken : ', oauthStoreAccessToken)

  // console.log('>>> MW > checkAuth > to : ', to)
  // console.log('>>> MW > checkAuth > router.currentRoute : ', router.currentRoute)

  if (!oauthAccessTokenFromLocalStorage) {
    // is token absent from localStorage ?

    // console.log('>>> MW > checkAuth > A => no access token in local storage => defaultRedirect :', defaultRedirect)
    return next()
  } else if (oauthAccessTokenFromLocalStorage && !oauthStoreAccessToken) {
    // is there a token in localStorage but not in store ?

    // console.log('>>> MW > checkAuth > B => access token in local storage but not in store yet ... ')

    const accessToken = localStorage[oauthAccessTokenName]
    const refreshToken = localStorage[oauthRefreshTokenName]
    const expiresIn = localStorage[oauthExpiresName]
    const tokenType = localStorage[oauthTokenTypeName]

    // console.log('>>> MW > checkAuth > B => accessToken : ', accessToken)
    // console.log('>>> MW > checkAuth > B => refreshToken : ', refreshToken)

    store.commit('oauth/setToken', { type: 'type', token: tokenType })
    store.commit('oauth/setToken', { type: 'expires', token: expiresIn })
    store.commit('oauth/setToken', { type: 'access', token: accessToken })
    store.commit('oauth/setToken', { type: 'refresh', token: refreshToken })

    // const authOptions = {
    //   bearerAuth: accessToken
    // }
    // console.log('>>> MW > checkAuth > B > authOptions :', authOptions)
    return router.push({ path: `${defaultRedirect}?redirect=${to.fullPath}` })
  } else {
    // console.log('>>> MW > checkAuth > C => access token in local storage AND in oauth store ')
    // const tokens = store.state.oauth.tokens
    // console.log('>>> MW > checkAuth > C => tokens : ', tokens)
    return next()
  }
}
