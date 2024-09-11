import React, { useState } from "react";
import { FaHome, FaUsers, FaRegFileExcel, FaUnity, FaClipboardList } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { PiChalkboardTeacher } from "react-icons/pi";
import { TbCategory } from "react-icons/tb";
import { MdOutlineCategory, MdAssignmentReturned } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { LiaDropbox } from "react-icons/lia";
import { FiTool } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import fondo from "/logoSena.png";

const Sidebar = ({ sidebarToggle }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const handleClick = () => {
    navigate("/dashboard");
  };

  const handleToggle = (panel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: sidebarToggle ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed w-64 bg-black h-full px-4 py-2 shadow-lg"
    >
      <div
        className="relative flex items-center font-inter my-2 mb-4"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img className="w-10 h-10 object-cover" src={fondo} alt="logoSena" />
        <div className="absolute top-0 left-14 z-10 font-inter text-lg custom-text">
          <h6 className="textMob text-white font-bold">Inventario del</h6>
          <h6 className="text-sena font-bold">Mobiliario</h6>
        </div>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold font-inter">
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/dashboard" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2"></FaHome>
            Dashboard
          </a>
        </li>

        {/* Usuarios */}
        <li className="mb-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("usuarios")}
          >
            <div className="flex items-center">
              <FaUserLarge className="inline-block w-6 h-6 mr-2 -mt-2" />
              Usuarios
            </div>
            <span>{expanded === "usuarios" ? "-" : "+"}</span>
          </div>
          {expanded === "usuarios" && (
            <ul className="bg-black text-center text-white text-sm">
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/Usuarios" className="px-3 flex items-center">
                <FaUserLarge className="inline-block w-4 h-4 mr-2 -mt-1"></FaUserLarge>
                Usuarios
                </a>
              </li>
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/roles" className="px-3 flex items-center">
                <FaUsers className="inline-block w-4 h-4 mr-2 -mt-1"></FaUsers>
                Roles
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Formación */}
        <li className="mb-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("formacion")}
          >
            <div className="flex items-center">
              <SiGoogleclassroom className="inline-block w-6 h-6 mr-2 -mt-2" />
              Formación
            </div>
            <span>{expanded === "formacion" ? "-" : "+"}</span>
          </div>
          {expanded === "formacion" && (
            <ul className="bg-black text-center text-white text-sm">
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/fichas" className="px-3 flex items-center">
                <SiGoogleclassroom className="inline-block w-4 h-4 mr-2 -mt-1"></SiGoogleclassroom>
                Fichas
                </a>
              </li>
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/instructores" className="px-3 flex items-center">
                <PiChalkboardTeacher className="inline-block w-4 h-4 mr-2 -mt-1"></PiChalkboardTeacher>
                Instructores
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Categorías */}
        <li className="mb-2">
          <div
            className="flex items-center justify-between px-3 py-2 rounded hover:shadow hover:bg-gray-700 cursor-pointer"
            onClick={() => handleToggle("categorias")}
          >
            <div className="flex items-center">
              <TbCategory className="inline-block w-6 h-6 mr-2 -mt-2" />
              Categorías
            </div>
            <span>{expanded === "categorias" ? "-" : "+"}</span>
          </div>
          {expanded === "categorias" && (
            <ul className="bg-black text-center text-white text-sm">
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/categorias" className="px-3 flex items-center">
                <TbCategory className="inline-block w-4 h-4 mr-2 -mt-1"></TbCategory>
                Categorías
                </a>
              </li>
              <li className="py-1 hover:bg-gray-700 rounded mx-4">
                <a href="/subcategorias" className="px-3 flex items-center">
                <MdOutlineCategory className="inline-block w-4 h-4 mr-2 -mt-1"></MdOutlineCategory>
                Subcategorías
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Otros enlaces */}
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/productos" className="px-3">
            <LiaDropbox className="inline-block w-6 h-6 mr-2 -mt-2"></LiaDropbox>
            Productos
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/herramientas" className="px-3">
            <FiTool className="inline-block w-6 h-6 mr-2 -mt-2"></FiTool>
            Herramientas
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/prestamos" className="px-3">
            <MdAssignmentReturned className="inline-block w-6 h-6 mr-2 -mt-2"></MdAssignmentReturned>
            Préstamos
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/pedidos" className="px-3">
            <FaClipboardList className="inline-block w-6 h-6 mr-2 -mt-2"></FaClipboardList>
            Pedidos
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/excel" className="px-3">
            <FaRegFileExcel className="inline-block w-6 h-6 mr-2 -mt-2"></FaRegFileExcel>
            Importar Excel
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
          <a href="/unidadmedida" className="px-3">
            <FaUnity className="inline-block w-6 h-6 mr-2 -mt-2"></FaUnity>
            Unidad de Medida
          </a>
        </li>
      </ul>
    </motion.div>
  );
};

export default Sidebar;
