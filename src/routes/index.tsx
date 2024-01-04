import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Layout } from '../screens/layout'

import { Home } from '../screens/home'
import { CreateAndUpdate } from '../screens/create-and-update'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/:id',
        element: <CreateAndUpdate />,
      },
    ],
  },
])

export function Routes() {
  return <RouterProvider router={router} />
}
