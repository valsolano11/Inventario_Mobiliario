import { DataTypes } from "sequelize";
import { conexion } from "../conexion.js";
import Usuario from "./Usuario.js";
import Estado from "./Estados.js";
import Subcategoria from "./Subcategoria.js";
import UnidadMedida from "./UnidadesMedidas.js";


const Producto = conexion.define(
    "Producto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
            validate: {
                notEmpty: {
                    msg: "El nombre del producto no puede estar vacío"
                },
            },
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "El codigo del producto no puede estar vacío"
                },
            },
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La descripcion del producto no puede estar vacío"
                },
            },
        },
        cantidadEntrada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La cantidad de entrada del producto no puede estar vacío"
                },
            },
        },
        cantidadSalida: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cantidadActual: {
            type: DataTypes.FLOAT,
            allowNull: false, 
        },
        volumen: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El volumen del producto no puede estar vacío"
                },
            },
        },  
        volumenTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },  
        marca:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La marca del producto no puede estar vacío"
                },
            },
        },
    },
    {
        tableName: "Productos",
        timestamps: true,
    }
)

Producto.belongsTo(Usuario, {foreignKey: "UsuarioId"});
Producto.belongsTo(Estado, {foreignKey: "EstadoId"});
Producto.belongsTo(Subcategoria, {foreignKey: "SubcategoriaId"});
Producto.belongsTo(UnidadMedida, { foreignKey: 'UnidadMedidaId' });

export default Producto;
