import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(text: any, search: any, searchKeyword?: any): any {
    // eslint-disable-next-line no-useless-escape
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern
      .split(' ')
      .filter((t: any) => {
        return t.length > 0;
      })
      .join('|');
    const regex = new RegExp(pattern, 'gi');

    if (!search) {
      return text;
    }

    if (searchKeyword) {
      const name = text[searchKeyword].replace(regex, (match: any) => `<b>${match}</b>`);
      // copy original object
      const textCopied = { ...text };
      // set bold value into searchKeyword of copied object
      textCopied[searchKeyword] = name;
      return textCopied;
    } else {
      return search ? text.replace(regex, (match: any) => `<b>${match}</b>`) : text;
    }
  }
}
