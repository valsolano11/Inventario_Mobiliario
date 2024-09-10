

import express from 'express';
import { getAllUnits, getUnitById } from '../controllers/UnidadesMedida.controller.js';

const UnidadMedidaRouter = express.Router();

UnidadMedidaRouter.get('/units', getAllUnits);
UnidadMedidaRouter.get('/units/:id', getUnitById);

export default UnidadMedidaRouter;
