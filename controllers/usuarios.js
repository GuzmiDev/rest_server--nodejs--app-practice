const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();

  res.json({ usuario });
};
const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({ usuario });
};
const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuarioAutenticado = req.usuario;

  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    {
      new: true,
    }
  );

  res.json({
    msg: "delete API - controlador",
    usuario,
    usuarioAutenticado,
  });
};
const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};
