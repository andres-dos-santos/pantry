import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Home } from '../screens/home'
import { Layout } from '../screens/layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // loader: rootLoader,
    children: [
      {
        path: '/pantry',
        element: <Home />,
        // loader: teamLoader,
      },
    ],
  },
])

export function Routes() {
  return <RouterProvider router={router} />
}
