import React from "react";

export const TareasSecundarias = ({tareaTops,nunTarea}) => {
  return (
    <div class="main">
      <div class="data">
        <div class="text">
          <div class="text_m">
            {tareaTops[nunTarea] ? tareaTops[nunTarea].nombre : "nombre"}{" "}
          </div>
          <div class="text_s">
            {tareaTops[nunTarea] ? tareaTops[nunTarea].tarea : "mensaje"}{" "}
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="likes">
          <svg viewBox="-2 0 105 92" class="likes_svg">
            <path d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71Z"></path>
          </svg>
          <span class="likes_text">0</span>
        </div>
        <div class="comments">
          <svg
            title="Comment"
            viewBox="-405.9 238 56.3 54.8"
            class="comments_svg"
          >
            <path d="M-391 291.4c0 1.5 1.2 1.7 1.9 1.2 1.8-1.6 15.9-14.6 15.9-14.6h19.3c3.8 0 4.4-.8 4.4-4.5v-31.1c0-3.7-.8-4.5-4.4-4.5h-47.4c-3.6 0-4.4.9-4.4 4.5v31.1c0 3.7.7 4.4 4.4 4.4h10.4v13.5z"></path>
          </svg>
          <span class="comments_text">0</span>
        </div>
      </div>
    </div>
  );
};
