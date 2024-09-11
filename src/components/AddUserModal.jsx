import React, { useEffect, useState } from "react";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AddUserModal = ({ isOpen, onClose, user }) => {
  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    Documento: "",
    correo: "",
    password: "",
    RolId: "",
    EstadoId: "",
  });
  const [permissions, setPermissions] = useState({
    admin: { option1: false, option2: false, option3: false },
    usuario: { option1: false, option2: false, option3: false },
    coordinador: { option1: false, option2: false, option3: false },
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        Documento: user.Documento || "",
        correo: user.correo || "",
        password: user.password || "",
        RolId: user.RolId || "",
        EstadoId: user.EstadoId || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/roles");
        setRoles(response.data);
      } catch (error) {
        showToastError("Error al cargar roles");
      }
    };

    const fetchStates = async () => {
      try {
        const response = await api.get("/Estado/tipo/usuario");
        setEstados(response.data);
      } catch (error) {
        showToastError("Error al cargar los estados");
      }
    };

    fetchRoles();
    fetchStates();
  }, []);

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (name === "nombre") {
      const nameRegex = /^[A-Za-z\s-_\u00C0-\u017F]+$/;
      if (!nameRegex.test(value) || /\d/.test(value)) {
        errorMessage = "El nombre no puede contener caracteres especiales.";
      }
    } else if (name === "correo") {
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!correoRegex.test(value)) {
        errorMessage = "El correo debe ser un correo válido.";
      }
    } else if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8,}$/;
      if (!passwordRegex.test(value)) {
        errorMessage =
          "La contraseña debe contener una mayúscula, una minúscula, un carácter especial, y entre 8 a 20 caracteres.";
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

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleCheckboxChange = (panel) => (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [panel]: { ...prevPermissions[panel], [name]: checked },
    }));
  };

  const handleSelectAllChange = (panel) => (e) => {
    const { checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [panel]: Object.fromEntries(
        Object.keys(prevPermissions[panel]).map((key) => [key, checked])
      ),
    }));
  };

  const isAllSelected = (panel) =>
    Object.values(permissions[panel]).every((value) => value);
  const isIndeterminate = (panel) =>
    Object.values(permissions[panel]).some((value) => value) &&
    !isAllSelected(panel);

  const resetForm = () => {
    setFormData({
      nombre: "",
      Documento: "",
      correo: "",
      password: "",
      RolId: "",
      EstadoId: "",
    });
    setAdminPermissions({
      addProducts: false,
    });
  };

  const handleCreate = async () => {
    const { nombre, correo, password, Documento, RolId, EstadoId } = formData;
    const nombreError = validateInput("nombre", nombre);
    const correoError = validateInput("correo", correo);
    const passwordError = validateInput("password", password);

    if (nombreError || correoError || passwordError) {
      setFormErrors({
        nombre: nombreError,
        correo: correoError,
        password: passwordError,
      });
      showToastError("Por favor, corrige los errores antes de agregar.");
      return;
    }

    if (!nombre || !Documento || !correo || !password || !RolId || !EstadoId) {
      showToastError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const response = await api.post("/usuarios", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Usuario agregado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        resetForm();
        setTimeout(() => {}, 2000);
      } else {
        showToastError(
          "Ocurrió un error!, por favor intenta con un documento o correo diferente."
        );
      }
    } catch (error) {
      showToastError(
        "Ocurrió un error!, por favor intenta con un documento o correo diferente."
      );
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
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/2 mt-4 max-h-screen overflow-y-auto">
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
                  Registro Usuario
                </h6>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Nombre Completo *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (/\d/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {formErrors.nombre && (
                      <div className="text-red-400 text-sm mt-1 px-2 min-w-[200px]">
                        {formErrors.nombre}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Documento *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="Documento"
                      value={formData.Documento}
                      onChange={handleInputChange}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">Correo *</label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="text"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                    />
                    {formErrors.correo && (
                      <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.correo}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">
                      Contraseña *
                    </label>
                    <input
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && (
                      <div className="text-red-400 text-sm mt-1 px-2">
                        {formErrors.password}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-x-4">
                  <div className="flex flex-col min-w-[200px] w-1/2">
                    <label className="mb-1 font-bold text-sm">Rol *</label>
                    <select
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      name="RolId"
                      value={formData.RolId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.rolName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col min-w-[200px] w-1/2 mb-4">
                    <label className="mb-1 font-bold text-sm">Estado *</label>
                    <select
                      className="bg-grisClaro text-sm rounded-lg px-2 h-8"
                      name="EstadoId"
                      value={formData.EstadoId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un estado</option>
                      {estados.map((estado) => (
                        <option
                          key={estado.id}
                          value={estado.id}
                          style={{
                            color:
                              estado.estadoName === "ACTIVO"
                                ? "green"
                                : estado.estadoName === "INACTIVO"
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {estado.estadoName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h6 className="font-bold text-center text-xl mb-2">Permisos</h6>
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleAccordionChange("panel1")}
                  sx={{
                    "&:before": { display: "none" },
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="font-bold text-sm"
                    sx={{
                      backgroundColor: "grisClaro.main",
                      borderRadius: "0.5rem",
                      minHeight: "unset",
                      "&.Mui-expanded": { minHeight: "unset" },
                      "& .MuiAccordionSummary-content": {
                        margin: "6px",
                        "&.Mui-expanded": { margin: "6px" },
                      },
                    }}
                  >
                    Admin
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="text-center">
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.775rem",
                            fontWeight: "bold",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={isAllSelected("admin")}
                            indeterminate={isIndeterminate("admin")}
                            onChange={handleSelectAllChange("admin")}
                          />
                        }
                        label="Seleccionar todos"
                      />
                    </div>
                    <div>
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.admin.option1}
                            onChange={handleCheckboxChange("admin")}
                            name="option1"
                          />
                        }
                        label="Agregar usuarios"
                      />
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.admin.option2}
                            onChange={handleCheckboxChange("admin")}
                            name="option2"
                          />
                        }
                        label="Editar usuarios"
                      />
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.admin.option3}
                            onChange={handleCheckboxChange("admin")}
                            name="option3"
                          />
                        }
                        label="Agregar productos"
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleAccordionChange("panel2")}
                  sx={{
                    "&:before": { display: "none" },
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="font-bold text-sm"
                    sx={{
                      backgroundColor: "grisClaro.main",
                      borderRadius: "0.5rem",
                      minHeight: "unset",
                      "&.Mui-expanded": { minHeight: "unset" },
                      "& .MuiAccordionSummary-content": {
                        margin: "6px",
                        "&.Mui-expanded": { margin: "6px" },
                      },
                    }}
                  >
                    Usuario
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="text-center">
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.775rem",
                            fontWeight: "bold",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={isAllSelected("usuario")}
                            indeterminate={isIndeterminate("usuario")}
                            onChange={handleSelectAllChange("usuario")}
                          />
                        }
                        label="Seleccionar todos"
                      />
                    </div>
                    <div>
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.usuario.option1}
                            onChange={handleCheckboxChange("usuario")}
                            name="option1"
                          />
                        }
                        label="Editar su perfil"
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleAccordionChange("panel3")}
                  sx={{
                    "&:before": { display: "none" },
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="font-bold text-sm"
                    sx={{
                      backgroundColor: "grisClaro.main",
                      borderRadius: "0.5rem",
                      minHeight: "unset",
                      "&.Mui-expanded": { minHeight: "unset" },
                      "& .MuiAccordionSummary-content": {
                        margin: "6px",
                        "&.Mui-expanded": { margin: "6px" },
                      },
                    }}
                  >
                    Coordinador
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="text-center">
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.775rem",
                            fontWeight: "bold",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={isAllSelected("coordinador")}
                            indeterminate={isIndeterminate("coordinador")}
                            onChange={handleSelectAllChange("coordinador")}
                          />
                        }
                        label="Seleccionar todos"
                      />
                    </div>
                    <div>
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.coordinador.option1}
                            onChange={handleCheckboxChange("coordinador")}
                            name="option1"
                          />
                        }
                        label="Agregar usuarios"
                      />
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.675rem",
                          },
                        }}
                        control={
                          <Checkbox
                            checked={permissions.coordinador.option2}
                            onChange={handleCheckboxChange("coordinador")}
                            name="option2"
                          />
                        }
                        label="Editar usuarios"
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>

                <div className="sm:w-full md:w-full flex flex-col justify-end">
                  <div className="flex justify-center mt-4 mb-4 mx-2">
                    <button className="btn-danger2 mx-2" onClick={onClose}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary2 mx-2"
                      onClick={handleCreate}
                    >
                      Agregar
                    </button>
                  </div>
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

export default AddUserModal;
