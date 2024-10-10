import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App.jsx'
import Test from './Test.jsx'
import ErrorPage from "./errorpage/ErrorPage.jsx"
import Homepage from "./homepage/Homepage.jsx"
import Search from "./search/Search.jsx"
import Profile from './profile/Profile.jsx'

export default function Router() {
    const router = createBrowserRouter([
        {
          path: '/',
          element: <App />,
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
        {
          path: '/test',
          element: <Test />
        }
      ])
      return <RouterProvider router={router} />
}