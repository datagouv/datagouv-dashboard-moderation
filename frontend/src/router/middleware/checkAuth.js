export default function checkAuth ({ next, store, from, to, router }) {
  
  
  
  

  // const defaultRedirect = process.env.VUE_APP_OAUTH_AUTHORIZE || '/authenticate'
  const defaultRedirect = '/reset-auth-api-client'

  const prefixLocalStorage = process.env.VUE_APP_OAUTH_LS_PREFIX
  const oauthAccessTokenName = `${prefixLocalStorage}AccessToken`
  const oauthRefreshTokenName = `${prefixLocalStorage}RefreshToken`
  const oauthExpiresName = `${prefixLocalStorage}Expires`
  const oauthTokenTypeName = `${prefixLocalStorage}TokenType`

  
  const oauthAccessTokenFromLocalStorage = localStorage[oauthAccessTokenName]
  

  const oauthStoreAccessToken = store.state.oauth.tokens.access.value
  

  
  

  if (!oauthAccessTokenFromLocalStorage) {
    // is token absent from localStorage ?

    
    return next()
  } else if (oauthAccessTokenFromLocalStorage && !oauthStoreAccessToken) {
    // is there a token in localStorage but not in store ?

    

    const accessToken = localStorage[oauthAccessTokenName]
    const refreshToken = localStorage[oauthRefreshTokenName]
    const expiresIn = localStorage[oauthExpiresName]
    const tokenType = localStorage[oauthTokenTypeName]

    
    

    store.commit('oauth/setToken', { type: 'type', token: tokenType })
    store.commit('oauth/setToken', { type: 'expires', token: expiresIn })
    store.commit('oauth/setToken', { type: 'access', token: accessToken })
    store.commit('oauth/setToken', { type: 'refresh', token: refreshToken })

    // const authOptions = {
    //   bearerAuth: accessToken
    // }
    
    return router.push({ path: `${defaultRedirect}?redirect=${to.fullPath}` })
  } else {
    
    // const tokens = store.state.oauth.tokens
    
    return next()
  }
}
