import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filterBy: string, properties: string[]): any[] {
    if (items.length === 0 || !filterBy || filterBy.length === 0) {
      return items;
    }

    let filteredItems: any[] = [];

    items.forEach((item) => {
      for (let key of properties) {
        if (item[key].toLowerCase().includes(filterBy.toLowerCase())) {
          filteredItems.push(item);
          break;
        }
      }
    });

    return filteredItems;
  }
}
