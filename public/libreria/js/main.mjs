import { proxy } from "./model/proxy.mjs";
import { router } from "./commons/router.mjs";
import { InvitadoHomePresenter } from "./components/invitado-home/invitado-home-presenter.mjs";
import { InvitadoNotFoundPresenter } from "./components/invitado-not-found/invitado-not-found-presenter.mjs";
import { InvitadoRegistroPresenter } from "./components/invitado-registro/invitado-registro-presenter.mjs";
import { InvitadoIngresoPresenter } from "./components/invitado-ingreso/invitado-ingreso-presenter.mjs";
import { ClientePerfilPresenter } from "./components/cliente-perfil/cliente-perfil-presenter.mjs";


export function init() {

  router.register(/^\/libreria\/not-found\.html/, new InvitadoNotFoundPresenter(proxy, 'invitado-not-found'));
  router.register(/^\/libreria\/index\.html$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria\/home\.html$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria$/, new InvitadoHomePresenter(proxy, 'invitado-home'));
  router.register(/^\/libreria\/cliente-perfil.html$/, new ClientePerfilPresenter(proxy, 'cliente-perfil'));
  router.register(/^\/libreria\/invitado-ingreso\.html$/, new InvitadoIngresoPresenter(proxy, 'invitado-ingreso'));
  router.register(/^\/libreria\/invitado-registro\.html$/, new InvitadoRegistroPresenter(proxy, 'invitado-registro'));
  router.handleLocation();
}