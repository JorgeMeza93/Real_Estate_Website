import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

Propiedad.belongsTo(Categoria, {foreignKey: "categoriaID"});
Propiedad.belongsTo(Precio, {foreignKey: "precioID"});
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioID"});

export { Usuario, Propiedad, Precio, Categoria }