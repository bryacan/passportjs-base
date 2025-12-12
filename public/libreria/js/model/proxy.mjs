import { libreriaSession } from "../commons/libreria-session.mjs";

export const ROL = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};


export class LibreriaProxy {

  constructor() { }

  /**
   * Libros
   */

  async getLibros() {
    let response = await fetch('http://localhost:3000/api/libros');
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Usuario
   */


  async addUsuario(obj) {
    let response = await fetch('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      let body = await response.json();
      throw new Error(`Error ${response.status}: ${response.statusText}\n ${body.message}`);
    }
  }

  async getUsuarioById(id) {
    let response = await fetch('/api/usuarios/'+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      let body = await response.json();
      throw new Error(`Error ${response.status}: ${response.statusText}\n ${body.message}`);
    }
  }


  async updateUsuario(obj) {    
    let response = await fetch('/api/usuarios/'+obj._id, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      let body = await response.json();
      throw new Error(`Error ${response.status}: ${response.statusText}\n ${body.message}`);
    }
  }

  async autenticar(obj) {
    let response = await fetch('/api/autenticar', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      let body = await response.json();
      throw new Error(`Error ${response.status}: ${response.statusText}\n ${body.message}`);
    }
  }

}

export const proxy = new LibreriaProxy();