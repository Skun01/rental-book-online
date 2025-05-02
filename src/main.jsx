import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import adminRoutes from "./routes/adminRoutes"
import userRoutes from "./routes/userRoutes"

const router = createBrowserRouter([...adminRoutes, ...userRoutes])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
console.log(router);

