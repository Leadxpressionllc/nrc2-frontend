import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  standalone: true,
  name: 'translateMessage',
})
export class TranslateMessagePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(errors: any, name: string, validations: any, prefix: string = 'validations'): any {
    let messageKey;
    for (const key in errors) {
      if (validations && validations[key]) {
        messageKey = validations[key].key;
      } else {
        messageKey = key;
      }
      return this.translateService.get(prefix + '.' + messageKey, this.getMessageParam(key, errors[key], name));
    }
  }

  private getMessageParam(key: string, error: any, name: string): any {
    let param = error && error.param;
    switch (key) {
      case 'minlength':
      case 'maxlength':
        param = { requiredLength: error.requiredLength };
        break;
      case 'ngbDateCustom':
        param = { format: error };
        break;
      case 'min':
        param = { min: error.min };
        break;
      case 'max':
        param = { max: error.max };
        break;
      case 'invalidPattern':
      case 'emailNotUnique':
        param = { message: error };
        break;
      default:
        break;
    }
    return { ...param, name: name ? name : 'This field' };
  }
}
