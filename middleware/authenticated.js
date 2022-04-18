export default ({ store, route, redirect }) => {
  const isAuthenticated = store.state.user.login
  if (isAuthenticated === false && route.name !== 'index') {
    console.log('hello' + isAuthenticated)
    return redirect('/')
  }
}