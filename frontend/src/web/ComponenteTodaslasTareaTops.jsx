import React from "react";
import { ComponenteTareaTop } from "./ComponenteTareaTop";
import { TareasSecundarias } from "./seccion tareas tops/TareasSecundarias";

export const ComponenteTodaslasTareaTops = ({ tareaTops }) => {

  
  return (
    <>
      <ComponenteTareaTop tareaTops={tareaTops} />
      <TareasSecundarias tareaTops={tareaTops} nunTarea={1} />
      <TareasSecundarias tareaTops={tareaTops}  nunTarea={2} />
    </>
  );
};
