import { Injectable } from '@angular/core';
import { constants } from '@app/constant';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  public static getCurrentDateTime(timezone: string): Date {
    const currentDate = new Date(moment.tz(timezone).format(constants.dateFormats.momentDateTime));
    return currentDate;
  }

  public static convertUTCToTimezone(dateTime: any, timezone: string): Date {
    return new Date(this.convertUTCToTimezoneAndFormat(dateTime, timezone, constants.dateFormats.momentDateTime));
  }

  public static convertUTCToTimezoneAndFormat(dateTime: any, timezone: string, format: string): string {
    return moment.utc(dateTime).tz(timezone).format(format);
  }
}
