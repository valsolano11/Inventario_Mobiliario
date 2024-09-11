import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPrestamoModal = ({ isOpen, onClose, prestamo }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [codigos, setCodigos] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [todasLasHerramientas, setTodasLasHerramientas] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    HerramientaId: "",
    codigo: "",
    UsuarioId: "",
    InstructorId: "",
    FichaId: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (prestamo) {
      setFormData({
        HerramientaId: prestamo.HerramientaId || "",
        codigo: prestamo.codigo || "",
        InstructorId: prestamo.InstructorId || "",
        UsuarioId: prestamo.UsuarioId || "",
        FichaId: prestamo.FichaId || "",
      });
    }
  }, [prestamo]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        showToastError("Error al cargar usuarios");
      }
    };

    const fetchFichas = async () => {
      try {
        const response = await api.get("/Fichas");
        setFichas(response.data);
      } catch (error) {
        showToastError("Error al cargar fichas");
      }
    };

    const fetchInstructores = async () => {
      try {
        const response = await api.get("/Instructor");
        setInstructores(response.data);
      } catch (error) {
        showToastError("Error al cargar instructores");
      }
    };

    const fetchNombresHerramientas = async () => {
      try {
        const response = await api.get('/herramienta/:nombres');
        setHerramientas(response.data);
      } catch (error) {
        showToastError("Error al cargar nombres de herramientas");
      }
    };


    fetchNombresHerramientas();
    fetchUsuarios();
    fetchFichas();
    fetchInstructores();
  }, []);
  

  const fetchCodigosHerramientas = async (nombre) => {
    if (nombre) {
      try {
        const filteredHerramientas = herramientas.filter(h => h.nombre === nombre && h.estado === 'ACTIVO');
        const codigos = filteredHerramientas.map(h => h.codigo);
        setCodigos(codigos);
      } catch (error) {
        // ... (manejo de errores)
      }
    } else {
      setCodigos([]);
    }
  };

  useEffect(() => {
    if (formData.HerramientaId) {
      fetchCodigosHerramientas(formData.HerramientaId);
    }
  }, [formData.HerramientaId]);

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

  const resetForm = () => {
    setFormData({
      HerramientaId: "",
      codigo: "",
      InstructorId: "",
      UsuarioId: "",
      FichaId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue =
      name === "UsuarioId" 
        ? Number(value)
        : value.toUpperCase();

    const errorMessage = validateInput(name, processedValue);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const validateInput = (name, value) => {
    if (!value) return "Este campo es obligatorio";
    return "";
  };

  const handleCreate = async () => {
    const { HerramientaId, InstructorId, codigo, UsuarioId, FichaId } = formData;

    if (!HerramientaId || !codigo || !InstructorId || !UsuarioId || !FichaId) {
      showToastError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/prestamo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Préstamo agregado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        resetForm();
        setTimeout(onClose, 2000);
      } else {
        showToastError("Ocurrió un error, por favor intenta con un nombre o código diferente.");
      }
    } catch (error) {
      showToastError("Ocurrió un error, por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center space-y-4 md:space-y-0 mb-4">
          <div className="w-full md:w-3/4">
            <div className="font-inter ml-2">
              <div className="space-y-2 md:space-y-2 text-left">
                <h6 className="font-bold text-center text-2xl mb-2">
                  Registro Préstamo
                </h6>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Nombre de la Herramienta *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="HerramientaId"
                    value={formData.HerramientaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Nombre</option>
                    {herramientas.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.HerramientaId && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.HerramientaId}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Código de la Herramienta *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Código</option>
                    {codigos.map((codigo) => (
                      <option key={codigo} value={codigo}>
                        {codigo}
                      </option>
                    ))}
                  </select>
                  {formErrors.codigo && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.codigo}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Usuario *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="UsuarioId"
                    value={formData.UsuarioId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.UsuarioId && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.UsuarioId}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Instructor *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="InstructorId"
                    value={formData.InstructorId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Instructor</option>
                    {instructores.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.InstructorId && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.InstructorId}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-bold text-sm">Ficha *</label>
                  <select
                    className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                    name="FichaId"
                    value={formData.FichaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar Ficha</option>
                    {fichas.map((ficha) => (
                      <option key={ficha.id} value={ficha.id}>
                        {ficha.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.FichaId && (
                    <div className="text-red-400 text-sm mt-1">
                      {formErrors.FichaId}
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    className="bg-green-500 text-white rounded-lg px-4 py-2"
                    onClick={handleCreate}
                    disabled={loading}
                  >
                    {loading ? "Creando..." : "Crear"}
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-lg px-4 py-2"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPrestamoModal;
