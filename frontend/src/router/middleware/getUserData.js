export default function getUserData ({ next, store, from, to, router }) {
  console.log('\n>>> MW > getUserData > ... ')
  console.log('>>> MW > getUserData > to : ', to)
  console.log('>>> MW > getUserData > from : ', from)
  console.log('>>> MW > getUserData > router : ', router)

  const oauthStoreAccessToken = store.state.oauth.tokens.access.value
  console.log('>>> MW > getUserData > oauthStoreAccessToken : ', oauthStoreAccessToken)

  if (!oauthStoreAccessToken) {
    console.log('>>> MW > getUserData > A => no access token in store ...')
    return next()
  } else {
    console.log('>>> MW > getUserData > B => access token in store > get user data from cli ')
    return router.push({ path: `/get-user-data?redirect=${to.fullPath}` })
    // return next()
  }
}
