import { Injectable } from "@angular/core";

@Injectable()
export class ModalLogic {
  public openModal(modal: any) {
    modal.style.display = 'flex'
  }

  public closeModal(modal: any) {
    modal.style.display = 'none'
  }
}
