import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Login } from "./formalariosRegistros/Login";
import { SingUp } from "./formalariosRegistros/SingUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Verificar } from "./formalariosRegistros/Verificar";
import { ProviderSIngUp } from "./Contextos/ProviderSIngUp";
import { ProviderTareas } from "./Contextos/ProviderTareas";
import { EstadoEliminarTarea } from "./Contextos/EstadoEliminarTarea";
import { ProviderPasarIdTareaCompletada } from "./Contextos/ProviderPasarIdTareaCompletada";
import { EstadosCrudNotas } from "./Contextos/EstadosCrudNotas";
import { ProviderEjecutarRetomarTiempo } from "./Contextos/ProviderEjecutarRetomarTiempo";
import { ErrorRouter } from "./ErrorRouter";
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
          <ProviderEjecutarRetomarTiempo>
          <EstadosCrudNotas>
            <ProviderPasarIdTareaCompletada>
              <EstadoEliminarTarea>
                <ProviderTareas>
                  <App />
                </ProviderTareas>
              </EstadoEliminarTarea>
            </ProviderPasarIdTareaCompletada>
          </EstadosCrudNotas>
          </ProviderEjecutarRetomarTiempo>
        ),
      },
    ],
  },
  {
    path: "*",
    element:<ErrorRouter/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
