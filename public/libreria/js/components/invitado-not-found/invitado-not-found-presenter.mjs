import { mensajes } from "../../commons/mensajes.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class InvitadoNotFoundPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  set url(url) {
    document.getElementById('url').innerHTML = url;
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();    
    this.url = new URLSearchParams(document.location.search).get('url');
  }

}