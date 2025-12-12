import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
// import { Router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";


export class ClientePerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get salirLink() { return document.querySelector('#salirLink'); }
  get modificarButton() { return document.querySelector('#modificarButton'); }
  get dniInput() { return document.querySelector('#dniInput'); }
  get dniText() { return this.dniInput.value; }
  set dniText(dni) { this.dniInput.value = dni; }
  get nombreInput() { return document.querySelector('#nombreInput'); }
  get nombreText() { return this.nombreInput.value; }
  set nombreText(nombre) { this.nombreInput.value = nombre; }
  get apellidosInput() { return document.querySelector('#apellidosInput'); }
  get apellidosText() { return this.apellidosInput.value; }
  set apellidosText(apellidos) { this.apellidosInput.value = apellidos; }
  get direccionInput() { return document.querySelector('#direccionInput'); }
  get direccionText() { return this.direccionInput.value; }
  set direccionText(direccion) { this.direccionInput.value = direccion; }
  get emailInput() { return document.querySelector('#emailInput'); }
  get emailText() { return this.emailInput.value; }
  set emailText(email) { this.emailInput.value = email; }
  get passwordInput() { return document.querySelector('#passwordInput'); }
  get passwordText() { return this.passwordInput.value; }
  set passwordText(password) { this.passwordInput.value = password; }


  get usuarioObject() {
    let resultado = {
      dni: this.dniText,
      email: this.emailText,
      nombres: this.nombreText,
      apellidos: this.apellidosText,
      direccion: this.direccionText
    }
    if (this.passwordText && this.passwordText.length > 0)
      resultado.password = this.passwordText;
    return resultado;
  }

  set usuarioObject(usuario) {
    this.dniText = usuario.dni;
    this.emailText = usuario.email;
    this.nombreText = usuario.nombres;
    this.apellidosText = usuario.apellidos;
    this.direccionText = usuario.direccion;
  }

  async salirClick(event) {
    event.preventDefault();
    libreriaSession.salir();
    this.mensajesPresenter.mensaje('Ha salido con éxito');
    router.navigate('./index.html');
  }

  async modificarClick(event) {
    event.preventDefault();
    try {
      this.updateForm.reportValidity();
      if (!this.updateForm.checkValidity()) throw new Error('El formulario no es válido');
      let obj = this.usuarioObject;
      obj._id = libreriaSession.getUsuarioId();
      let u = await this.model.updateUsuario(obj)
      this.mensajesPresenter.mensaje('Usuario modificado', u);
      // router.navigate('./home.html');
      this.refresh();
    } catch (err) {
      this.mensajesPresenter.error(err.message);
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    console.log('perfil')
    try {
      let usuario = await this.model.getUsuarioById(libreriaSession.getUsuarioId());
      this.usuarioObject = usuario;
      this.modificarButton.onclick = event => this.modificarClick(event);
      this.salirLink.onclick = event => this.salirClick(event);
    } catch (err) {
      console.error(err);
      router.navigate('/libreria/not-found.html?url=' + encodeURIComponent('/libreria/cliente-perfil.html'));
    }
  }

}