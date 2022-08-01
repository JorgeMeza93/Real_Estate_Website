import { check, validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js"

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis propiedades",
        barra: true
    });
}
// Formulario para crear una nueva propoiedad
const crear = async (req, res) => {
    //Consultar Modelo de Precios y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
    res.render("propiedades/crear", {
        pagina: "Crear propiedad",
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}
const guardar = async(req, res) => {
    await check("titulo").notEmpty().withMessage("El titulo no puede ir vacío").run(req);
    await check("descripcion").notEmpty().withMessage("La descripción no puede ir vacía").isLength( {max: 700} ).withMessage("La descripción debe ser menor a 700 carácteres").run(req);
    await check("categoria").isNumeric().withMessage("Selecciona una categoría").run(req);
    await check("precio").isNumeric().withMessage("Selecciona un rango de precio").run(req);
    await check("habitaciones").isNumeric().withMessage("Seleccione un número de habitaciones").run(req);
    await check("estacionamiento").isNumeric().withMessage("Seleccione lugares de estacionamientos").run(req);
    await check("banos").isNumeric().withMessage("Seleccione el número mínimo de baños").run(req);
    await check("jardin").isNumeric().withMessage("Seleccione si cuenta con jardín").run(req);
    await check("lat").notEmpty().withMessage("Ubica la propiedad en el mapa").run(req);
    await check("lng"),notEmpty().withMessage("Ubica la propiedad en el maoa").run(req);
    console.log(req.body.lat);
    let resultado = validationResult(req);
    if( !resultado.isEmpty() ){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);
        res.render("propiedades/crear", {
            pagina: "Crear Propiedad",
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
        console.log(resultado.array())
    } 
    // No hay errores por consiguiente se crea un registro
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, banos, jardin, calle, lat, lng, precio: precioID, categoria: categoriaID } = req.body;
        const propiedadAlmacenada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            banos,
            jardin,
            calle,
            lat,
            lng,
            precioID,
            categoriaID
        })
    } catch (error) {
        console.log(error)
    }

}


export { admin, crear, guardar };

        /*await check("titulo").notEmpty().withMessage("El nombre no puede ir vacío").run(req);
            let resultado = validationResult(req)
            if( !resultado.isEmpty() ){
                const [categorias, precios] = await Promise.all([
                    Categoria.findAll(),
                    Precio.findAll()
                ]);
                return res.render("propiedades/crear", {
                    pagina: "Crear Propiedad",
                    barra: true,
                    csrfToken: req.csrfToken(),
                    categorias,
                    precios,
                    errores: resultado.array()
                });
            }

            */