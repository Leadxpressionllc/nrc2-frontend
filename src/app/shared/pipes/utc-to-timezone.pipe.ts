import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeService } from '@core/utility-services';

@Pipe({
  standalone: true,
  name: 'utcToTimezone',
})
export class UtcToTimezonePipe implements PipeTransform {
  timezone!: string;

  constructor() {
    this.timezone = 'America/New_York';
  }

  transform(value: any, format?: string, timezone: string = this.timezone): any {
    if (value) {
      if (format) {
        return DateTimeService.convertUTCToTimezoneAndFormat(value, timezone, format);
      }

      return DateTimeService.convertUTCToTimezone(value, timezone);
    }

    return value;
  }
}
