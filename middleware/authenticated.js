export default function ({ store, route, redirect }) {
  const isAuthenticated = store.getters.isAuthenticated
  console.log('isAuthenticated: ' + isAuthenticated)
  if (isAuthenticated) {
    if (route.name === 'index') {
      return redirect('/list')
    }
  } else {
    if (route.name !== 'index') {
      return redirect('/')
    }
  }
}
