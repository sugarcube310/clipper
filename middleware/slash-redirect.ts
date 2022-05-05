export default function ({ route, redirect }: { route: any, redirect: any }) {
  if (route.path.slice(-1) !== '/') {
    redirect(301, route.path + '/')
  }
}