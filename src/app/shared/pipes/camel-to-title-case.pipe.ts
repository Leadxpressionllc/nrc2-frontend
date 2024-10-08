import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToTitleCase',
  standalone: true,
})
export class CamelToTitleCasePipe implements PipeTransform {
  transform(value: string | undefined, ...args: unknown[]): string {
    if (value) {
      return value
        .split(' ')
        .map((val) => {
          return val[0].toUpperCase() + val.substring(1).toLowerCase();
        })
        .join(' ');
    }
    return '';
  }
}
