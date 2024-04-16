import React from 'react';
import ReactDOM from 'react-dom/client';



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { Login } from './formalariosRegistros/Login';
import { SingUp } from './formalariosRegistros/SingUp';
import { Verificar } from './formalariosRegistros/Verificar';
import { ProviderSIngUp } from './Contextos/ProviderSIngUp';
import { ProviderTareas } from './Contextos/ProviderTareas';
import { EstadoEliminarTarea } from './Contextos/EstadoEliminarTarea';
import { ProviderPasarIdTareaCompletada } from './Contextos/ProviderPasarIdTareaCompletada';
import { EstadosCrudNotas } from './Contextos/EstadosCrudNotas';
import { ProviderEjecutarRetomarTiempo } from './Contextos/ProviderEjecutarRetomarTiempo';
import { ErrorRouter } from './ErrorRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <ProviderSIngUp>
            <Login />
          </ProviderSIngUp>
        } />
        <Route path="/singUp" element={<SingUp />} />
        <Route path="/app" element={
          <ProviderSIngUp>
            <Verificar />
          </ProviderSIngUp>
        }>
          <Route index element={
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
          } />
        </Route>
        <Route path="*" element={<ErrorRouter />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
