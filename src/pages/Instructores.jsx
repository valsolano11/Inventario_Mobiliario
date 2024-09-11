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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditInstructorModal from "../components/EditInstructorModal";
import AddInstructorModal from "../components/AddInstructorModal";

const Instructores = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // CODIGO USANDO INDICES, AUN NO SE PUEDE SIN TENER EL NUEVO BACK END.
  //   const fetchData = async () => {
  //     console.time('fetchData');
  //     setLoading(true);
  //     try {
  //       const response = await api.get('/Instructor', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });

  //       const InstructoresConUsuariosyEstados = response.data.map(instructor => ({
  //         ...instructor,
  //       nombre: instructor.Usuario ? instructor.Usuario.nombre : 'Desconocido',
  //       estadoName: instructor.Estado ? instructor.Estado.estadoName : 'Desconocido',
  //       }));

  //       InstructoresConUsuariosyEstados.sort((a, b) => a.id - b.id);
  //       setData(InstructoresConUsuariosyEstados);

  //     } catch (error) {
  //         console.error('Error fetching categoria data:', error);
  //     }
  //     setLoading(false);
  //     console.timeEnd('fetchData');
  // };

  // useEffect(() => {
  //     fetchData();
  // }, []);

  const fetchData = async () => {
    //  console.time('fetchData');
    setLoading(true);
    try {
      const response = await api.get("/Instructor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const InstructoresyCreador = await Promise.all(
        response.data.map(async (instructor) => {
          const usuarioResponse = await api.get(
            `/usuarios/${instructor.UsuarioId}`
          );
          const estadoResponse = await api.get(
            `/Estado/${instructor.EstadoId}`
          );

          return {
            ...instructor,
            usuarioname: usuarioResponse.data.nombre,
            estadoName: estadoResponse.data.estadoName,
          };
        })
      );

      InstructoresyCreador.sort((a, b) => a.id - b.id);
      setData(InstructoresyCreador);
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
    // console.timeEnd('fetchData');
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const instructor = data[rowIndex];
    setSelectedInstructor(instructor);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModalIntructor = (updateIntructor) => {
    if (updateIntructor) {
      fetchData();
    }
    setSelectedInstructor(null);
    setIsOpenEditModal(false);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModalIntructor = (newIntructor) => {
    if (newIntructor) {
      fetchData();
    }
    setSelectedInstructor(null);
    setIsOpenAddModal(false);
  };

  const columsInstructor = [
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
      name: "nombre",
      label: "NOMBRE",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "correo",
      label: "CORREO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "celular",
      label: "TELEFONO",
      options: {
        customHeadRender: (columnMeta) => (
          <th className="text-center bg-white text-black uppercase text-xs font-bold">{columnMeta.label}</th>
        ),
        customBodyRender: (value) => <div className="text-center">{value}</div>,
      },
    },
    {
      name: "usuarioname",
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
      Nombre: row.data[1],
      Correo: row.data[2],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Instructores");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Instructores.xlsx");
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
            Agregar Instructor
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-7xl overflow-auto">
            {loading ? (
              <div className="text-center">Cargando Instructores...</div>
            ) : (
              <MUIDataTable
                title={<span className="custom-title">INSTRUCTORES</span>} 
                data={data}
                columns={columsInstructor}
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
      {selectedInstructor && (
        <EditInstructorModal
          isOpen={isOpenEditModal}
          onClose={handleCloseEditModalIntructor}
          instructor={selectedInstructor}
        />
      )}
      <AddInstructorModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModalIntructor}
      />
    </div>
  );
};

export default Instructores;
