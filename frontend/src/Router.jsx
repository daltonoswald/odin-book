import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Welcome from './welcome/Welcome.jsx'
import ErrorPage from "./errorpage/ErrorPage.jsx"
import Homepage from "./homepage/Homepage.jsx"
import Search from "./search/Search.jsx"
import Profile from './profile/Profile.jsx'

export default function Router() {
    const router = createBrowserRouter([
        {
          path: '/',
          element: <Welcome />,
          errorElement: <ErrorPage />
        },
        {
          path: '/home',
          element: <Homepage />,
        },
        {
          path: '/search',
          element: <Search />,
        },
        {
          path: '/profile/:username',
          element: <Profile />
        },
      ])
      return <RouterProvider router={router} />
}