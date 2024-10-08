import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnum',
  standalone: true,
})
export class FormatEnumPipe implements PipeTransform {
  transform(value: string | undefined, charCase: 'uppercase' | 'lowercase' | 'titlecase' = 'titlecase'): string | undefined {
    if (value) {
      value = value.trim().replace(/_/g, ' ');
      if (charCase === 'lowercase') {
        value = value.toLowerCase();
      } else if (charCase === 'uppercase') {
        value = value.toUpperCase();
      } else {
        value = value
          .split(' ')
          .map((val) => {
            return val[0].toUpperCase() + val.substring(1).toLowerCase();
          })
          .join(' ');
      }
    }

    return value;
  }
}
