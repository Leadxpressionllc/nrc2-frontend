import { Directive, Input, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Directive()
export abstract class DialogBaseDirective implements OnDestroy {
  eventEmitter = new Subject<any>();
  bsModalRef!: BsModalRef;
  loading!: Subscription;
  isOpened = false;
  data: any;
  @Input('_data') set _data(value: any) {
    this.data = value;
  }

  onClose(e?: any): void {
    this.eventEmitter.next(e);
    this.isOpened = false;
    this.bsModalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.isOpened) {
      this.isOpened = false;
    }
    if (this.loading) {
      this.loading.unsubscribe();
    }
    this.eventEmitter.unsubscribe();
  }
}
