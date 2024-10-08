import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true,
})
export class EllipsisPipe implements PipeTransform {
  transform(value: any, limit: number): any {
    if (value instanceof Array) {
      // Handle input of type string array
      return value.map((str) => this.truncate(str, limit)).join(', ');
    } else if (typeof value === 'string') {
      // Handle input of type string
      return this.truncate(value, limit);
    }
  }

  private truncate(value: string, limit: number): string {
    if (value.length > limit) {
      return `${value.substring(0, limit)}...`;
    }
    return value;
  }
}
