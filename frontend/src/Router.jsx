import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App.jsx'
import Test from './Test.jsx'
import ErrorPage from "./errorpage/ErrorPage.jsx"

export default function Router() {
    const router = createBrowserRouter([
        {
          path: '/',
          element: <App />,
          errorElement: <ErrorPage />
        },
        {
          path: '/test',
          element: <Test />
        }
      ])
      return <RouterProvider router={router} />
}