import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Login } from "./login singUp/Login";
import { SingUp } from "./login singUp/singUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Verificar } from "./login singUp/Verificar";
import { ProviderSIngUp } from "./Contextos/ProviderSIngUp";
import { ProviderTareas } from "./Contextos/ProviderTareas";
import { EstadoEliminarTarea } from "./Contextos/EstadoEliminarTarea";
import { ProviderPasarIdTareaCompletada } from "./Contextos/ProviderPasarIdTareaCompletada";
import { EstadosCrudNotas } from "./Contextos/EstadosCrudNotas";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProviderSIngUp>
        <Login />
      </ProviderSIngUp>
    ),
  },
  {
    path: "/singUp",
    element: <SingUp />,
  },
  {
    path: "/app",
    element: (
      <ProviderSIngUp>
        <Verificar />
      </ProviderSIngUp>
    ),
    children: [
      {
        path: "/app",
        element: (
          <EstadosCrudNotas>
            <ProviderPasarIdTareaCompletada>
              <EstadoEliminarTarea>
                <ProviderTareas>
                  <App />
                </ProviderTareas>
              </EstadoEliminarTarea>
            </ProviderPasarIdTareaCompletada>
          </EstadosCrudNotas>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <h1>la pagina no exite</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
