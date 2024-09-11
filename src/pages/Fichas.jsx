import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditFichasModal from "../components/EditFichasModal";
import AddFichasModal from "../components/AddFichasModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fichas = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Fichas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const fichasConUsuariosYEstados = response.data.map((ficha) => ({
        ...ficha,
        nombre: ficha.Usuario ? ficha.Usuario.nombre : "Desconocido",
        estadoName: ficha.Estado ? ficha.Estado.estadoName : "Desconocido",
      }));

      fichasConUsuariosYEstados.sort((a, b) => a.id - b.id);
      setData(fichasConUsuariosYEstados);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar los datos de las fichas", {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const ficha = data[rowIndex];
    setSelectedFicha(ficha);
    setIsOpenEditModal(true);
  };

  const handleCloseAddModalFichas = (newFicha) => {
    if (newFicha) {
      fetchData();
    }
    setSelectedFicha(null);
    setIsOpenAddModal(false);
  };

  const handleCloseEditModalFichas = (updatedFicha) => {
    if (updatedFicha) {
      fetchData();
    }
    setSelectedFicha(null);
    setIsOpenEditModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "NumeroFicha",
      label: "FICHA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "Programa",
      label: "PROGRAMA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "Jornada",
      label: "JORNADA",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombre",
      label: "USUARIO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
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
      },
    },
  ];

  const handleCustomExport = (rows) => {
    const exportData = rows.map((row) => ({
      id: row.data[0],
      Ficha: row.data[1],
      Programa: row.data[2],
      Jornada: row.data[3],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fichas");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Fichas.xlsx");
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
          <button
            className="btn-primary"
            onClick={() => setIsOpenAddModal(true)}
          >
            Agregar Ficha
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl overflow-auto">
            {loading ? (
              <div className="text-center">Cargando Fichas...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">FICHAS</span>} 
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
      {selectedFicha && (
        <EditFichasModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalFichas}
          ficha={selectedFicha}
        />
      )}
      <AddFichasModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModalFichas}
      />
    </div>
  );
};

export default Fichas;
