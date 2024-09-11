import React, { useState } from "react";

const TablaPedidos = ({ accordionStates, toggleAccordion }) => {
  const [formErrors, setFormErrors] = useState({});
  const [productos, setProductos] = useState([
    {
      nombreProducto: "",
      descripcion: "",
      unidadMedida: "",
      cantidadSolicitar: "",
      observaciones: "",
    },
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProductos = [...productos];
    newProductos[index][name] = value;
    setProductos(newProductos);
  };

  const addRow = () => {
    setProductos([
      ...productos,
      {
        nombreProducto: "",
        descripcion: "",
        unidadMedida: "",
        cantidadSolicitar: "",
        observaciones: "",
      },
    ]);
  };

  return (
    <div>
      {accordionStates.productos && (
        <div className="flex flex-col rounded-lg w-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black px-2">ITEM</th>
                  <th className="border border-black px-2">NOMBRE DEL PRODUCTO</th>
                  <th className="border border-black px-2">DESCRIPCIÓN</th>
                  <th className="border border-black px-2">UNIDAD DE MEDIDA</th>
                  <th className="border border-black px-2">CANTIDAD A SOLICITAR</th>
                  <th className="border border-black px-2">OBSERVACIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="border border-black px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="nombreProducto"
                        value={producto.nombreProducto}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="unidadMedida"
                        value={producto.unidadMedida}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 rounded"
                        name="cantidadSolicitar"
                        value={producto.cantidadSolicitar}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                    <td className="border border-black px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 rounded"
                        name="observaciones"
                        value={producto.observaciones}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button className="btn-black2" onClick={addRow}>
              Agregar item
            </button>
            <button className="btn-black2 mb-4" onClick={() => handleCreate("productos")}>
              Guardar y continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPedidos;
