import { Router } from "express";
import { crearFicha, getAllFichas, getFicha, updateFicha  } from "../controllers/Formacion/Fichas.controller.js";
import validarSchemas from "../middlewares/ValidarSchemas.js";
import { FichaSchemas } from "../schemas/Fichas.schemas.js";
import { rutaProtegida } from "../middlewares/ValidarToken.js";
import { validarRolAdmin } from "../middlewares/ValidarRol.js";



const FichaRouter = Router()

FichaRouter.get("/Fichas", rutaProtegida, getAllFichas);
FichaRouter.get("/Fichas/:id", rutaProtegida,  getFicha);
FichaRouter.post("/Fichas",rutaProtegida,validarRolAdmin,validarSchemas(FichaSchemas), crearFicha);
FichaRouter.put("/Fichas/:id", rutaProtegida,  updateFicha); 

export default FichaRouter