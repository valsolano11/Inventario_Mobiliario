import { Op } from "sequelize";
import Estado from "../../models/Estados.js";
import Ficha from "../../models/Fichas.js";
import Usuario from "../../models/Usuario.js";
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
import parseExcel from "../../helpers/excel.js";
import ExcelFile from "../../models/Excel.js";


export const crearFicha = async (req, res) => {
  try {
    const { UsuarioId, EstadoId, NumeroFicha, Programa, Jornada } = req.body;

    const consultaId = await Ficha.findOne({ 
      where: {NumeroFicha}
    });
    if (consultaId) {
      return res.status(400).json({ message: "La ficha ya existe" });
    }

    const consultaUsuario = await Usuario.findByPk(UsuarioId);
    if (!consultaUsuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const consultaEstado = await Estado.findByPk(EstadoId);
    if (!consultaEstado) {
      return res.status(400).json({ message: "El estado especificado no existe" });
    }

    const nuevaFicha = { NumeroFicha, Programa, Jornada, EstadoId, UsuarioId,};

    const fichaCreada = await Ficha.create(nuevaFicha);

    res.status(200).json(fichaCreada);
  } catch (error) {
    console.error("Error al crear la ficha", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllFichas = async (req, res) => {
  try {
    let Fichas = await Ficha.findAll({
      attributes: null, 
      include: [
      {
         model: Usuario, 
        atributes:['nombre'] 
      },
      { 
        model: Estado,
        attributes: ['estadoName'],
       }],
    });

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFicha = async (req, res) => {
  try {
    let Fichas = await Ficha.findByPk(req.params.id);

    if (!Fichas) {
      return res.status(404).json({ mensaje: "No se encontró la ficha" });
    }

    res.status(200).json(Fichas);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateFicha = async (req, res) => {
  try {
    const { id } = req.params;
    const { UsuarioId, EstadoId, NumeroFicha, Programa, Jornada } = req.body;

    const ficha = await Ficha.findByPk(id);
    if (!ficha) {
      return res.status(404).json({ message: "No se encontró ninguna ficha" });
    }

    if (NumeroFicha) {
      const consultaId = await Ficha.findOne({
        where: {
          NumeroFicha,
          id: { [Op.ne]: ficha.id }, 
        },
      });
      if (consultaId) {
        return res
          .status(400)
          .json({ message: "La ficha con el mismo NumeroFicha ya existe" });
      }
      ficha.NumeroFicha = NumeroFicha;
    }

    if (UsuarioId) {
      const consultaUsuario = await Usuario.findByPk(UsuarioId);
      if (!consultaUsuario) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
      ficha.UsuarioId = UsuarioId;
    }

    if (EstadoId) {
      const consultaEstado = await Estado.findByPk(EstadoId);
      if (!consultaEstado) {
        return res
          .status(400)
          .json({ message: "El estado especificado no existe" });
      }
      ficha.EstadoId = EstadoId;
    }

    if (Programa !== undefined) {
      ficha.Programa = Programa;
    }
    if (Jornada !== undefined) {
      ficha.Jornada = Jornada;
    }

    await ficha.save();

    res.status(200).json(ficha);
  } catch (error) {
    console.error("Error al actualizar la ficha", error);
    res.status(500).json({ message: error.message });
  }
};
// Vinculación con la parte de excel 
export const createFicha = async (fichaData) => {
  return await Ficha.create(fichaData);
};

export const bulkCreateFichas = async (fichasData) => {
  try {
    await Ficha.bulkCreate(fichasData, {
      updateOnDuplicate: ["NumeroFicha", "Programa", "Jornada", "EstadoId", "UsuarioId"],
    });
  } catch (error) {
    throw new Error(
      "Error al insertar fichas en la base de datos: " + error.message
    );
  }
};

export const syncDatabase = async () => {
  await ExcelFile.sync();
  await Ficha.sync();
};


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const uploadPath = path.join(dirname, "../../upload");


export const uploadFichas = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.join(uploadPath, req.file.filename);
    console.log(`Archivo recibido: ${filePath}`);

    const excelFile = await ExcelFile.create({ fileName: req.file.filename });

    const fichasData = parseExcel(filePath);

    await bulkCreateFichas(fichasData);

    excelFile.status = "processed";
    await excelFile.save();

    fs.unlinkSync(filePath);

    res
      .status(201)
      .json({ message: "Fichas uploaded and processed successfully." });
  } catch (error) {
    console.error("Error al procesar el archivo:", error.message);
    res
      .status(500)
      .json({ message: "Error al procesar el archivo: " + error.message });
  }
};