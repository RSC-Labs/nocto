import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app.js"
import { noctoConfig } from "../nocto-config"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App noctoConfig={noctoConfig}/>
  </React.StrictMode>
)
