import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmitterService {
  private eventEmitters: { [ID: string]: Subject<any> } = {};

  get(ID: string): Subject<any> {
    if (!this.eventEmitters[ID]) {
      this.eventEmitters[ID] = new Subject();
    }
    return this.eventEmitters[ID];
  }

  emit(ID: string, data?: any): void {
    if (this.eventEmitters[ID]) {
      this.eventEmitters[ID].next(data);
    }
  }

  subscribe(ID: string, callBack: (data?: any) => any): void {
    this.get(ID).subscribe(callBack);
  }

  unsubscribe(ID: string): void {
    if (this.eventEmitters[ID]) {
      this.eventEmitters[ID].unsubscribe();
      delete this.eventEmitters[ID];
    }
  }
}
