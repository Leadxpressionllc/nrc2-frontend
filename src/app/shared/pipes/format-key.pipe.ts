import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatKey',
  standalone: true,
})
export class FormatKeyPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    if (value) {
      let newValue: string[] = [];
      const chars = Array.from(value);

      chars.forEach((char: string) => {
        if (char.toUpperCase() && char != char.toLowerCase()) {
          newValue.push(' ');
          newValue.push(char);
        } else {
          newValue.push(char);
        }
        newValue[0] = newValue[0].toUpperCase();
      });
      value = newValue.join('');
    }

    return value;
  }
}
