import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToString',
  pure: false,
  standalone: true,
})
export class ArrayToStringPipe implements PipeTransform {
  transform(value: any[] | undefined, separator = ', '): string {
    if (value && value.length > 0) {
      return value.join(separator);
    }
    return '';
  }
}
