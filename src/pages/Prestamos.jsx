import React, { useState, useEffect } from "react";
import { api } from "../api/token";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import EditPrestamoModal from "../components/EditPrestamoModal";
import AddPrestamoModal from "../components/AddPrestamoModal";
import clsx from "clsx";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";


const Prestamos = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    console.time('fetchData');
    setLoading(true);
    try {
      const response = await api.get("/prestamo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const prestaentaConEstadoUsuarioSub = response.data.map((presta) => ({
        ...presta,
        nombreuser: presta.Usuario ? presta.Usuario.nombre : "Desconocido",
        nombreinstructor: presta.Instructore ? presta.Instructore.nombre : "Desconocido",
        NumeroFicha: presta.Ficha ? presta.Ficha.NumeroFicha : "Desconocido",
        nombreherra: presta.Herramientum ? presta.Herramientum.nombre : "Desconocido",
        codigoherra: presta.Herramientum ? presta.Herramientum.codigo : "Desconocido",
        estadoName: presta.Estado ? presta.Estado.estadoName : "Desconocido",
      }));
      

      prestaentaConEstadoUsuarioSub.sort((a, b) => a.id - b.id);
      setData(prestaentaConEstadoUsuarioSub);
    } catch (error) {
      console.error("Error fetching prestamos data:", error);
      toast.error("Error al cargar los datos de los prestamos", {
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
    const prestamo = data[rowIndex];
    setSelectedPrestamo(prestamo);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = (updatedPrestamo) => {
    if (updatedPrestamo) {
      fetchData();
    }
    setIsOpenEditModal(false);
    setSelectedPrestamo(null);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = (newPrestamo) => {
    if (newPrestamo) {
      fetchData();
    }
    setIsOpenAddModal(false);
  };

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombreherra",
      label: "Herramienta",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "codigoherra",
      label: "codigo",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "observaciones",
      label: "observaciones",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "FechaPrestamo",
      label: "FechaPrestamo",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "FechaDevolucion",
      label: "FechaDevolucion",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombreinstructor",
      label: "instructor",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "NumeroFicha",
      label: "Ficha",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "nombreuser",
      label: "usuario",
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
              "text-olive-300": value === "ENTREGADO",
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
      codigo: row.data[0],
      id: row.data[1],
      fichaId: row.data[2],
      UsuarioId: row.data[3],
      InstructorId: row.data[4],
      prestaentaId: row.data[5],
      Cantidad: row.data[6],
      FechaPrestamo: row.data[7],
      FechaDevolucion: row.data[8],
      EstadoId: row.data[9],
      observaciones: row.data[10],
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prestamos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Prestamos.xlsx");
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
            Agregar Préstamo
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-9xl mx-auto">
            {loading ? (
              <div className="text-center">Cargando préstamos...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">PRÉSTAMOS</span>}
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
                      className: "custom-table",
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
                      rowsPerPage: "Filas por página:",
                      displayRows: "de",
                    },
                    toolbar: {
                      search: "Buscar",
                      downloadCsv: "Descargar CSV",
                      print: "Imprimir",
                      viewColumns: "Ver Columnas",
                      filterTable: "Filtrar Tabla",
                    },
                    filter: {
                      all: "Todos",
                      title: "FILTROS",
                      reset: "REINICIAR",
                    },
                    viewColumns: {
                      title: "Mostrar Columnas",
                      titleAria: "Mostrar/Ocultar Columnas",
                    },
                    selectedRows: {
                      text: "fila(s) seleccionada(s)",
                      delete: "Eliminar",
                      deleteAria: "Eliminar filas seleccionadas",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      {selectedPrestamo && (
        <EditPrestamoModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModal}
          prestamo={selectedPrestamo}
        />
      )}
      <AddPrestamoModal isOpen={isOpenAddModal} onClose={handleCloseAddModal}/>
    </div>
  );
};
export default Prestamos;