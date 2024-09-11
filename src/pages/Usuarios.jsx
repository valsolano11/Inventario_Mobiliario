import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import EditUserModal from "../components/EditUserModal";
import AddUserModal from "../components/AddUserModal";
import clsx from "clsx";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";

const Usuarios = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // console.time('fetchData');
    setLoading(true);
    try {
      const response = await api.get("/usuarios", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const usuariosConRolesYEstados = response.data.map((usuario) => ({
        ...usuario,
        rolName: usuario.Rol ? usuario.Rol.rolName : "Desconocido",
        estadoName: usuario.Estado ? usuario.Estado.estadoName : "Desconocido",
      }));

      usuariosConRolesYEstados.sort((a, b) => a.id - b.id);
      setData(usuariosConRolesYEstados);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar los datos de usuarios", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
    // console.timeEnd('fetchData');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const user = data[rowIndex];
    setSelectedUser(user);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedUser) => {
    if (updatedUser) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newUser) => {
    if (newUser) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        )
      },
    },
    {
      name: "Documento",
      label: "DOCUMENTO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "nombre",
      label: "NOMBRE",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "correo",
      label: "CORREO",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "rolName",
      label: "ROL",
      options: {
        customBodyRender: (value) => <div className="text-center">{value}</div>,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
      },
    },
    {
      name: "estadoName",
      label: "ESTADO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => (
          <div
            className={clsx("text-center", {
              "text-green-500": value === "ACTIVO",
              "text-red-500": value === "INACTIVO",
              "text-gray-500": value === "AGOTADO",
              "text-yellow-500": value === "PENDIENTE",
              "text-blue-500": value === "EN PROCESO",
              "text-orange-500": value === "EN USO",
              "text-green-300": value === "ENTREGADO",
              "text-purple-500": value === "DEVUELTO",
            })}
          >
            {value}
          </div>
        ),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } }),
      },
    },
    {
      name: "edit",
      label: "EDITAR",
      options: {
        filter: false,
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value, tableMeta, updateValue) => (
          <div className="flex items-center justify-center">
            <IconButton
              onClick={() => handleEditClick(tableMeta.rowIndex)}
              color="primary"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
        setCellHeaderProps: () => ({ style: { textAlign: 'center' } }),
      },
    },
  ];

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      id: row.data[0],
      Nombre: row.data[2],
      Correo: row.data[3],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Usuarios.xlsx");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarToggle={sidebarToggle} />
      <div
        className={`flex flex-col flex-grow p-6 bg-gray-100 ${
          sidebarToggle ? "ml-64" : ""
        } mt-16`}
      >
        <Home
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />
        <div className="flex justify-end mt-2">
          <button className="btn-primary" onClick={handleOpenAddModal}>
            Agregar Usuario
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando usuarios...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">USUARIOS</span>} 
                data={data}
                columns={columns}
                options={{
                  responsive: "standard",
                  selectableRows: "none",
                  download: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 15],
                  setTableProps: () => {
                    return {
                      className: "custom-tables",
                    };
                  },
                  onDownload: (buildHead, buildBody, columns, data) => {
                    handleCustomExport(data);
                    return false;
                  },
                  textLabels: {
                    body: {
                      noMatch: "Lo siento, no se encontraron registros",
                      toolTip: "Ordenar",
                    },
                    pagination: {
                      next: "Siguiente",
                      previous: "Anterior",
                      rowsPerPage: "Filas por página",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Mostrar columnas",
                      filterTable: "Filtrar tabla",
                    },
                    filter: {
                      all: "Todos",
                      title: "FILTROS",
                      reset: "REINICIAR",
                    },
                    viewColumns: {
                      title: "Mostrar columnas",
                      titleAria: "Mostrar/Ocultar Columnas",
                    },
                    selectedRows: {
                      text: "fila(s) seleccionada(s)",
                      delete: "Eliminar",
                      deleteAria: "Eliminar fila seleccionada",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      {selectedUser && (
        <EditUserModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          user={selectedUser}
        />
      )}
      <AddUserModal isOpen={isOpenAddModal} onClose={handleCloseAddModal} />
    </div>
  );
};

export default Usuarios;
