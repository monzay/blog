import React, { useContext, useState } from "react";
import { contextoEstadosCrudNotas } from "../Contextos/EstadosCrudNotas";
import iconsEliminar from "../../public/Icons/eliminar.svg"
import iconsEditar from "../../public/Icons/editar.svg"
const style = {
  width: "100%",
  background: "rgba(255,255,255,0.1)",
  padding: "20px 0px",
  margin: "10px 5px",
  borderRadius: "5px",
};

export const Nota = ({ nota }) => {
  const { setDependenciasCrudNotas } = useContext(contextoEstadosCrudNotas);

  const [mostrarModelActualizarNota, setMostrarModelActualizarNota] =
    useState(false);
  const [newNota, setNewNota] = useState("");

  // variable globales
  const notaslocales = JSON.parse(localStorage.getItem("notas"));
  const id = nota.id;

  const eliminarNota = () => {
    const newArrayNotas = notaslocales.filter((nota) => nota.id !== id);
    localStorage.setItem("notas", JSON.stringify(newArrayNotas));
    setDependenciasCrudNotas({
      actualizar: false,
      eliminar: !false,
      añadir: false,
    });
  };

  const actualizarNota = (e) => {
    e.preventDefault();

    const notaOriginal = notaslocales.find((nota) => nota.id === id);

    const nuevaNota = {
      ...notaOriginal,
      nota: newNota ? newNota : notaOriginal.nota,
    };

    // Actualiza el almacenamiento local con los datos de la nueva nota
    const nuevasNotas = notaslocales.map((nota) =>
      nota.id === id ? nuevaNota : nota
    );

    localStorage.setItem("notas", JSON.stringify(nuevasNotas));
    setDependenciasCrudNotas({
      actualizar: !false,
      eliminar: false,
      añadir: false,
    });
  };

  return (
    <div className="contenedor-nota">
      <span className="nota-nota"> {nota.nota}</span>
      {mostrarModelActualizarNota && (
        <form onSubmit={(e) => actualizarNota(e)}>
          <input onChange={(e) => setNewNota(e.target.value)} type="text" />
          <button>enviar</button>
        </form>
      )}
      <div style={{display:"flex"}} className="contenedor-btn-nota">
        <div   onClick={eliminarNota} className="btn-nota">
          <img  className="icons-nota" src={iconsEliminar} alt="" />
        </div>
        <div onClick={() => setMostrarModelActualizarNota(true)}className="btn-nota" >
          <img  className="icons-nota" src={iconsEditar} alt="" />
        </div>
      </div>
    </div>
  );
};
