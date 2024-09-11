import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fondo from "/logoSena.png";
import siga from "/Siga.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaGripLinesVertical } from "react-icons/fa6";
import FirmasDos from './../components/FirmasDos';
import TablaPedidosFirma from "../components/TablaPedidosFirma";

const FirmaPedidos = () => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    Documento: "",
    fecha: "",
    ficha: "",
    area: "",
    coordi: "",
    cedCoordi: "",
    instructor: "",
    cedInstructor: "",
    item: "",
    codigoSena: "",
  });
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/formatoHerramientas");
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const [accordionStates, setAccordionStates] = useState({
    datos: false,
    productos: false,
    firmas: false,
  });

  const toggleAccordion = (section) => {
    setAccordionStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "area" || name === "coordi" || name === "instructor") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "No puede contener caracteres especiales.";
      }
    } 
    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showToastError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleCreate = (currentSection) => {
    const {nombre, Documento, ficha, fecha, area, coordi, cedCoordi, instructor, cedInstructor } = formData;
    const areaError = validateInput("area", area);
    const coordiError = validateInput("coordi", coordi);
    const instructorError = validateInput("instructor", instructor);

    if (areaError || coordiError || instructorError) {
      setFormErrors({
        area: areaError,
        coordi: coordiError,
        instructor: instructorError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }

    if (!nombre || !Documento || !fecha || !ficha || !area || !coordi || !cedCoordi || !instructor || !cedInstructor) {
      showToastError("Todos los campos son obligatorios, incluyendo la fecha.");
      return;
    }

      // Cerrar el acordeón actual y abrir el siguiente
  if (currentSection === "datos") {
    setAccordionStates({
      datos: false,
      productos: true,
      firmas: false,
    });
  } else if (currentSection === "productos") {
    setAccordionStates({
      datos: false,
      productos: false,
      firmas: true,
    });
  } else if (currentSection === "firmas") {
    setAccordionStates({
      datos: false,
      productos: false,
      firmas: false,
    });
  }

    // setLoading(true);
    // try {
    //   if (response.status === 201) {
    //     toast.success("Usuario agregado exitosamente", {
    //       position: "top-right",
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     resetForm();
    //     setTimeout(() => {}, 2000);
    //   } else {
    //     showToastError(
    //       "Ocurrió un error!, por favor intenta con un documento o correo diferente."
    //     );
    //   }
    // } catch (error) {
    //   showToastError(
    //     "Ocurrió un error!, por favor intenta con un documento o correo diferente."
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-grisClaro">
      <div className="hidden md:flex items-star justify-center md:w-2/3 bg-grisClaro mx-4">
        <div className="w-full mt-10">
          <div className={"px-4 py-3 w-full"}>
            <div className="flex justify-between text-xs w-auto">
              <img
                className="w-20 h-20 object-cover ml-4 mr-2"
                src={fondo}
                alt="logoSena"
              />
              <div className="flex flex-col items-center text-base">
                <span className="text-black text-center font-semibold hidden md:inline">
                  FORMATO DE SOLICITUD DE SALIDA DE BIENES PARA EL USO DE LOS
                  CUENTADANTES QUE TIENEN VÍNCULO CON LA ENTIDAD
                </span>
              </div>
              <img
                className="flex justify-end w-auto h-14 object-cover mt-2 ml-2"
                src={siga}
                alt="siga"
              />
            </div>

          {/* DATOS FIJOS */}
            <div className={"px-2 py-2 w-full mt-6"}>
              <div className="flex flex-col space-y-4 md:space-y-0 text-xs w-full">
                <div className="w-full font-inter text-left">
                  <div className="space-y-1">
                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-xs mt-2">
                          Código Regional
                        </label>
                        <input
                          className="bg-grisClaro border-b border-black text-xs text-black w-6 px-2 h-8"
                          type="text"
                          name="name"
                          value="5"
                          readOnly
                        />
                      </div>

                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-xs mt-2">
                          Nombre Regional
                        </label>
                        <input
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                          type="text"
                          name="name"
                          value="Antioquia"
                          readOnly
                        />
                      </div>
                      <div className="flex flex-row">
                        <label className="mb-1 font-bold text-xs mt-2">
                          Código Centro de Costos
                        </label>
                        <input
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-20 px-2 h-8"
                          type="text"
                          name="name"
                          value="920510"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-x-4">
                      <div className="flex flex-row w-4/5">
                        <label className="mb-1 font-bold text-xs mt-2">
                          Nombre Centro de Costos
                        </label>
                        <input
                          className="bg-grisClaro border-b border-black text-xs text-center text-black w-80 px-2 h-8"
                          type="text"
                          name="name"
                          value="Centro Tecnólogico del Mobiliario"
                          readOnly
                        />
                      </div>
                      <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                        <label className="mb-1 font-bold text-xs mt-2">
                          Fecha de Solicitud*
                        </label>
                        <input
                          className="bg-grisClaro border-b border-black text-xs px-2 h-8"
                          type="date"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DATOS */}
            <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mt-4 mb-4">
              <button
                onClick={() => toggleAccordion("datos")}
                className="font-bold text-lg py-2 flex justify-between items-center w-full"
              >
                <span>Datos</span>
                <ExpandMoreIcon className="mr-2" />
              </button>

              {accordionStates.datos && (
                <div className="flex flex-col rounded-lg w-full">
                  <div className="flex flex-col md:flex-row justify-between gap-x-4">
                    <div className="flex flex-row min-w-[200px] w-full md:w-2/3">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Código de grupo o ficha de caracterización*
                      </label>
                      <input
                        className=" border-b border-black text-xs text-center h-8 w-20"
                        type="text"
                        name="ficha"
                        value={formData.ficha}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={7}
                      />
                    </div>
                    <div className="flex flex-row min-w-[200px] w-full md:w-1/3">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Área*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className=" border-b border-black text-xs text-center h-8 w-200"
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {formErrors.area && (
                          <div className="text-red-400 text-xs mt-1 px-2">
                            {formErrors.area}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-x-4">
                    <div className="flex flex-row w-full md:w-3/4">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Nombre de jefe de oficina o coordinador de área:*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className=" border-b border-black text-xs text-center px-2 h-8"
                          type="text"
                          name="coordi"
                          value={formData.coordi}
                          onChange={handleInputChange}
                        />
                        {formErrors.coordi && (
                          <div className="text-red-400 text-xs mt-1 px-2">
                            {formErrors.coordi}
                          </div>
                        )}
                      </div>                      
                    </div>

                    <label className="mb-1 font-bold text-xs mt-2">
                      Cédula*
                    </label>
                    <input
                      className=" border-b border-black text-xs text-center h-8 w-20"
                      type="text"
                      name="cedCoordi"
                      value={formData.cedCoordi}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                    />
                    {formErrors.Documento && (
                      <div className="text-red-400 text-xs mt-1 px-2">
                        {formErrors.Documento}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-x-4">
                    <div className="flex flex-row w-full md:w-3/4">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Nombre del servidor público a quien se le asignará el
                        bien*
                      </label>
                      <div className="flex flex-col">
                        <input
                          className=" border-b border-black text-xs text-center px-2 h-8"
                          type="text"
                          name="instructor"
                          value={formData.instructor}
                          onChange={handleInputChange}
                        />
                        {formErrors.instructor && (
                          <div className="text-red-400 text-xs mt-1 px-2">
                            {formErrors.instructor}
                          </div>
                        )}
                      </div>                      
                    </div>

                    <div className="flex flex-row w-full md:w-1/4">
                      <label className="mb-1 font-bold text-xs mt-2">
                        Cédula*
                      </label>
                      <input
                        className=" border-b border-black text-xs text-center h-8 w-20"
                        type="text"
                        name="cedInstructor"
                        value={formData.cedInstructor}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={10}
                      />
                      {formErrors.Documento && (
                        <div className="text-red-400 text-xs mt-1 px-2">
                          {formErrors.Documento}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button className="btn-black2 mb-4" onClick={() => handleCreate("datos")}>
                      Guardar y continuar</button>
                  </div>
                </div>
              )}
            </div>

            {/* PEDIDOS */}
            <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
              <button
                onClick={() => toggleAccordion("productos")}
                className="font-bold text-lg py-2 flex justify-between items-center w-full"
              >
                <span>Pedidos</span>
                <ExpandMoreIcon className="mr-2" />
              </button>

              {accordionStates.productos && (
                <div className="flex flex-col rounded-lg w-full">
                  <div className="flex flex-row justify-between w-full mb-4">
                    <TablaPedidosFirma
                      accordionStates={accordionStates}
                      toggleAccordion={toggleAccordion}
                    />
                  </div>
                </div>
              )}
            </div>

            {/*FIRMAS */}
            <div className="flex flex-col rounded-lg w-full bg-white px-8 mx-auto border-2 border-black mb-4">
              <button
                onClick={() => toggleAccordion("firmas")}
                className="font-bold text-lg py-2 flex justify-between items-center w-full"
              >
                <span>Firmas</span>
                <ExpandMoreIcon className="mr-2" />
              </button>

              {accordionStates.firmas && (
                <div className="flex flex-col rounded-lg w-full">
                  <div className="flex flex-row justify-between w-auto mb-4">
                    <FirmasDos
                      accordionStates={accordionStates}
                      toggleAccordion={toggleAccordion}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                  <button className="btn-black2 mb-4" onClick={() => handleCreate("firmas")}>Guardar</button>
                  </div>
                </div>
              )}              
            </div>

            <div className="flex justify-center items-center w-2/4 mt-10 mx-auto">
              <button className="btn-black2">Enviar Pedido</button>              
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-negro flex justify-center items-center md:clip-path2 h-full md:h-auto">
        <div className="main w-3/4 md:w-1/2 text-center text-lg">
          <div className="letras font-inter mb-4 md:mb-8">
            <h1 className="text-white font-normal text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Bienvenido a
            </h1>
            <h1 className="text-white font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              inventario del
            </h1>
            <h1 className="text-sena font-semibold text-2xl md:text-4xl lg:text-5xl mt-2 md:mt-4">
              Mobiliario
            </h1>
          </div>

          <div className="mt-2 text-center">
            <h1 className="text-white text-xs md:text-lg -mt-2 mb-4">
              Aquí puedes revisar y firmar los pedidos realizados para ello inicia sesión.
            </h1>
          </div>

          <div className="flex justify-center mt-4 md:mt-8">
            <button className="btn-primary" onClick={handleNavigate}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FirmaPedidos
