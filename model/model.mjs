import { Libro } from './libro.mjs';
import { Usuario } from './usuario.mjs';

export const ROL = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};

export class Libreria {

  constructor() { }

  /**
   * Libros
   */

  async setLibros(ls) {
    await Libro.deleteMany();
    return await Promise.all(ls.map(l => new Libro(l).save()));
  }

  async getLibros() {
    return await Libro.find();
  }

  /**
   * Usuario
   */

  async setClientes(cs) {
    await Usuario.deleteMany({ rol: ROL.CLIENTE });
    return await Promise.all(cs.map(l => new Usuario(c).save()));
  }

  async addCliente(obj) {
    let cliente = await this.getClientePorEmail(obj.email);
    if (cliente) throw new Error('Correo electrónico registrado');
    return await new Usuario(obj).save();
  }

  async addUsuario(obj) {
    if (obj.rol == ROL.CLIENTE)
      return await this.addCliente(obj);
    else if (obj.rol == ROL.ADMIN)
      return await this.addAdmin(obj);
    else throw new Error('Rol desconocido');
  }


  async getClientePorEmail(email) {
    return await Usuario.findOne({ rol: ROL.CLIENTE, email: email });
  }

  async getClientePorEmail(email) {
    return await Usuario.findOne({ rol: ROL.CLIENTE, email: email });
  }


  async updateUsuario(obj) {
    let usuario = await Usuario.findById(obj._id);
    usuario.nombres = obj.nombres;
    usuario.apellidos = obj.apellidos;
    usuario.email = obj.email;
    usuario.direccion = obj.direccion;
    usuario.password = obj.password;
    usuario.dni = obj.dni;
    return await usuario.save();
  }

  async autenticar(obj) {
    let email = obj.email;
    let password = obj.password;
    let usuario;

    if (obj.rol == ROL.CLIENTE) usuario = await this.getClientePorEmail(email);
    else if (obj.rol == ROL.ADMIN) usuario = await this.getAdministradorPorEmail(email);
    else throw new Error('Rol no encontrado');

    if (!usuario) throw new Error('Usuario no encontrado');
    else if (usuario.password == password) return usuario;
    else throw new Error('Error en la contraseña');
  }
}

export const model = new Libreria();