import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Contras_1 from "./pages/Contras_1.jsx";
import Contras_2 from "./pages/Contras_2.jsx";
import Contra_3 from "./pages/Contras_3.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Roles from "./pages/Roles.jsx";
import Categorias from "./pages/Categorias.jsx";
import Instructores from "./pages/Instructores.jsx";
import Fichas from "./pages/Fichas.jsx";
import ImportExcel from "./pages/ImportExcel.jsx";
import Subcategorias from "./pages/Subcategorias.jsx";
import UnidadMedida from "./pages/UnidadMedida.jsx";
import Productos from "./pages/Productos.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Herramientas from "./pages/Herramientas.jsx";
import Prestamos from "./pages/Prestamos.jsx";
import Pedidos from "./pages/Pedidos.jsx";
import Historial from "./pages/Historial.jsx";
import Formularios from "./pages/Formularios.jsx";
import PedidosIntructores from "./pages/PedidosIntructores.jsx";
import FirmaPedidos from "./pages/FirmaPedidos.jsx";
import FormatoHerram from "./pages/FormatoHerram.jsx";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/contras_1" element={<Contras_1 />} />
          <Route path="/contras_2" element={<Contras_2 />} />
          <Route path="/contras_3" element={<Contra_3 />} />
          <Route path="/formularios" element={<Formularios />} />
          <Route path="/pedInstructores" element={<PedidosIntructores />} />
          <Route path="/formatoHerramientas" element={<FormatoHerram />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/subcategorias" element={<Subcategorias />} />
            <Route path="/instructores" element={<Instructores />} />
            <Route path="/fichas" element={<Fichas />} />
            <Route path="/excel" element={<ImportExcel />} />
            <Route path="/unidadmedida" element={<UnidadMedida />} />
            <Route path='/productos' element={<Productos/>}/> 
            <Route path='/herramientas' element={<Herramientas/>}/>
            <Route path='/prestamos' element={<Prestamos/>}/>  
            <Route path='/pedidos' element={<Pedidos/>}/>
            <Route path='/historial' element={<Historial/>}/>
          </Route>

          {/* Ruta protegida para el RolId 2 */}
          <Route element={<ProtectedRoute requiredRoleId={2} />}>
            <Route path="/firmaPedidos" element={<FirmaPedidos />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
