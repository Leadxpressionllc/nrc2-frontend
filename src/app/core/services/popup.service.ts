import { Injectable } from '@angular/core';
import { PopupProps } from '@core/models';
import { DialogBaseDirective, PopupComponent } from '@shared/components';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private openedDialogs: any = {};

  constructor(private modalService: BsModalService) {}

  open(data: any, props?: PopupProps): any {
    const key = PopupComponent.id;
    if (key in this.openedDialogs && this.openedDialogs[key].isOpened) {
      return this.openedDialogs[key];
    }

    const modalRef = this.modalService.show(PopupComponent, this._getProps(props, data));
    const componentInstance = this._setComponentInstance(modalRef);
    this.openedDialogs[key] = modalRef.content;
    return componentInstance;
  }

  openWithComponent(component: any, data?: any, props?: PopupProps): DialogBaseDirective {
    const key = component.id ? component.id : component.name;
    if (key in this.openedDialogs && this.openedDialogs[key].isOpened) {
      return this.openedDialogs[key];
    }
    const modalRef = this.modalService.show(component, this._getProps(props, data));
    const componentInstance = this._setComponentInstance(modalRef);
    this.openedDialogs[key] = modalRef.content;
    return componentInstance;
  }

  showAlert(heading: string, message: string, okButtonText?: string, okButtonClass?: string, props?: PopupProps): any {
    const key = PopupComponent.id;
    if (key in this.openedDialogs && this.openedDialogs[key].isOpened) {
      return this.openedDialogs[key];
    }
    const modalRef = this.modalService.show(
      PopupComponent,
      this._getProps(props, { heading, message, type: 'alert', okButtonText, okButtonClass })
    );
    const componentInstance = this._setComponentInstance(modalRef);
    this.openedDialogs[key] = modalRef.content;
    return componentInstance;
  }

  showConfirmation(
    heading: string,
    message: string,
    successButtonText?: string,
    failureButtonText?: string,
    successButtonClass?: string,
    failureButtonClass?: string,
    props?: PopupProps
  ): any {
    const key = PopupComponent.id;
    if (key in this.openedDialogs && this.openedDialogs[key].isOpened) {
      return this.openedDialogs[key];
    }
    const modalRef = this.modalService.show(
      PopupComponent,
      this._getProps(props, {
        heading,
        message,
        type: 'confirm',
        successButtonText,
        failureButtonText,
        successButtonClass,
        failureButtonClass,
      })
    );
    const componentInstance = this._setComponentInstance(modalRef);
    this.openedDialogs[key] = modalRef.content;
    return componentInstance;
  }

  private _setComponentInstance(modalRef: BsModalRef): any {
    const componentInstance = modalRef.content;
    componentInstance.bsModalRef = modalRef;
    componentInstance.isOpened = true;
    return componentInstance;
  }

  private _getProps(props: any, data: any): any {
    const backdrop = props && props.backdrop !== undefined ? props.backdrop : 'static';
    const keyboard = props && props.keyboard !== undefined ? props.keyboard : true;
    const size = props && props.size !== undefined ? props.size : 'md';
    const cssClass = props && props.class !== undefined ? props.class : '';
    return { backdrop, keyboard, class: cssClass + ' modal-' + size + ' modal-dialog-centered', initialState: { _data: data } };
  }

  isPopupOpened(key: string): boolean {
    if (key in this.openedDialogs) {
      return this.openedDialogs[key].isOpened;
    }
    return false;
  }

  getOpenPopups(): any {
    return this.openedDialogs;
  }

  closeAllOpenPopups() {
    const openedPopups = this.getOpenPopups();
    Object.keys(openedPopups).forEach((key) => {
      if (openedPopups[key].isOpened) {
        openedPopups[key].bsModalRef.hide();
      }
    });
  }
}
