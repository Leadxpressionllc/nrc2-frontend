import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '@core/utility-services';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  constructor() {}

  transform(value: any): string {
    let time = null;
    if (value instanceof Date) {
      time = value;
    } else {
      time = new Date(value);
    }

    const now = DateTimeService.getCurrentDateTime('America/New_York');
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    } else if (seconds < 120) {
      return 'a minute ago';
    } else if (seconds < 3600) {
      return Math.floor(seconds / 60) + ' minutes ago';
    } else if (seconds < 7200) {
      return 'an hour ago';
    } else if (seconds < 86400) {
      return Math.floor(seconds / 3600) + ' hours ago';
    } else if (seconds < 2 * 86400) {
      return ' a day ago';
    } else {
      return Math.floor(seconds / 86400) + ' days ago';
    }
  }
}
