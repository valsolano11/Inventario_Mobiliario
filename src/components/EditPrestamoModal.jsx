import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/token";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPrestamoModal = ({ isOpen, onClose, prestamo }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    observaciones: "",
    HerramientaNombre: "",
    HerramientaCodigo: "",
    InstructorNombre: "",
    FichaNumero: "",
    FechaPrestamo: "",
  });

  useEffect(() => {
    if (isOpen && prestamo) {
      fetchformData(prestamo.id);
    }
  }, [isOpen, prestamo]);

  const fetchformData = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/prestamo/${id}`);
      console.log(response.data); 
      if (response.status === 200) {
        const { observaciones, FechaPrestamo, Herramientum, Instructore, Ficha } = response.data;
        setFormData({
          observaciones: observaciones || "",
          HerramientaNombre: Herramientum?.nombre || "",
          HerramientaCodigo: Herramientum?.codigo || "",
          InstructorNombre: Instructore?.nombre || "",
          FichaNumero: Ficha?.NumeroFicha || "",
          FechaPrestamo: FechaPrestamo || "",
        });
        setLoading(false);
      } else {
        console.error("Error fetching Prestamo details:", response.data.message);
        toast.error("Error al cargar la información del Prestamo.", {
          position: "top-right",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pedido Prestamo:", error);
      toast.error("Error al cargar la información del Prestamo.", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    const { observaciones } = formData;

    if (!observaciones) {
      toast.error("El campo de observación es obligatorio.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/prestamo/${prestamo.id}`,
        {
          observaciones: formData.observaciones,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Prestamo actualizado exitosamente", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          onClose(response.data);
        }, 2000);
      } else {
        console.error("Error updating Prestamo:", response.data.message);
        toast.error("Error al actualizar la información del Prestamo.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating Prestamo:", error);
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error al actualizar la información del Prestamo.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fondo bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:w-full md:w-1/4 mt-4 max-h-screen overflow-y-auto">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <FaTimes className="text-black w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-0 mb-4">
          <div className="w-full px-4">
            <div className="font-inter text-center">
              <h6 className="font-bold text-center text-2xl mb-4">Herramienta</h6>
              {formData && (
                <p className="text-sm mb-4">
                  La herramienta con el código <strong>{formData.HerramientaCodigo || 'N/A'}</strong>  que está prestada 
                  por el Instructor <strong>{formData.InstructorNombre || 'N/A'}</strong>  en 
                  la Ficha <strong>{formData.FichaNumero || 'N/A'}</strong>  a las <strong>{formData.FechaPrestamo || 'N/A'}</strong> va a ser 
                    entregada. De acuerdo a esto, puede escribir alguna observación en el siguiente campo.
                </p>
              )}
              <div className="flex flex-col">
                <label className="mb-0.5 font-bold text-xs">Observación *</label>
                <textarea
                  className="bg-gray-200 text-xs rounded-lg px-2 py-1"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:w-full flex flex-col justify-end">
          <div className="flex justify-center mb-4 mx-2">
            <button className="btn-danger2 mx-2" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-primary2 mx-2"
              onClick={handleUpdate}
              disabled={loading}
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditPrestamoModal;
