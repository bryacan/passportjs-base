import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { ROL } from "../../model/proxy.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class InvitadoIngresoPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get ingresoButton() { return document.querySelector('#ingresarInput'); }
  get emailInput() { return document.querySelector('#emailInput'); }
  get emailText() { return this.emailInput.value; }
  get passwordInput() { return document.querySelector('#passwordInput'); }
  get passwordText() { return this.passwordInput.value; }
  get rolSelect() { return document.querySelector('#rolSelect'); }
  get rolText() { return this.rolSelect.value; }

  get usuarioObject() {
    return { email: this.emailText, password: this.passwordText, rol: this.rolText }
  }

  async ingresoClick(event) {
    event.preventDefault();
    try {
      // 1. Autenticar y obtener token [cite: 189]
      let respuestaAuth = await this.model.autenticar(this.usuarioObject);
      
      // 2. Guardar token
      libreriaSession.setToken(respuestaAuth.token); // [cite: 191]

      // 3. Obtener datos del usuario usando el token (recurso privado)
      let usuario = await this.model.getUsuarioActual(); // [cite: 192]

      // 4. Guardar sesión de usuario
      libreriaSession.ingreso(usuario); // [cite: 194]

      this.mensajesPresenter.mensaje(`Bienvenido ${usuario.nombres} ${usuario.apellidos}!`);
      
      if (libreriaSession.esCliente())
        await router.navigate('/libreria/cliente-perfil.html');
      else if (libreriaSession.esAdmin())
        await router.navigate('/libreria/admin-perfil.html');
      else throw new Error('Rol no identificado');

    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message);
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.ingresoButton.onclick = event => this.ingresoClick(event);
  }

}