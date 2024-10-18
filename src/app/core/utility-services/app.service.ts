import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { constants } from '@app/constant';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  public static isUndefinedOrNull(value: any): boolean {
    return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) || value.length === 0;
  }

  public static isNumber(value: any): boolean {
    if (value) {
      return !_.isNaN(value);
    }
    return false;
  }

  public static markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    for (const i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsDirty();
        group.controls[i].setErrors(group.controls[i].errors);
      } else if (group.controls[i] instanceof FormGroup) {
        AppService.markAsDirty(group.controls[i] as FormGroup);
      }
    }

    const elementList: any = document.querySelectorAll('.form-select.ng-invalid, .form-control.ng-invalid');
    if (elementList && elementList.length > 0) {
      elementList[0].focus();
    }
  }

  public static markFormControlAsDirty(formControl: FormControl): void {
    formControl.markAsDirty();
    formControl.setErrors(formControl.errors);

    const elementList: any = document.querySelectorAll('.form-select.ng-invalid, .form-control.ng-invalid');
    if (elementList && elementList.length > 0) {
      elementList[0].focus();
    }
  }

  public static isDateEqual(startDate: Date, endDate: Date): boolean {
    return this.compareDates(startDate, endDate) === 0;
  }

  private static compareDates(startDate: Date, endDate: Date): number {
    startDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
    return startDate.getTime() - endDate.getTime();
  }

  public static isEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length === 0;
  }

  public static getDateStringFromDate(dateObj: { day: number; month: number; year: number }): string {
    const month = dateObj.month <= 9 ? '0' + dateObj.month : dateObj.month;
    const day = dateObj.day <= 9 ? '0' + dateObj.day : dateObj.day;
    return dateObj.year + '-' + month + '-' + day;
  }

  public static getDateObject(date: Date): any {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }

  public static getDateStringFromDateObject(date: Date): any {
    const month = date.getMonth() <= 9 ? '0' + date.getMonth() : date.getMonth();
    const day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + '-' + month + '-' + day;
  }

  public static formatDate(date: Date): string {
    const dateObj = this.getDateObject(date);
    return this.getDateStringFromDate(dateObj);
  }

  public static cloneObject(objectToCopy: any): any {
    return JSON.parse(JSON.stringify(objectToCopy));
  }

  public static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static stringToDate(date: string, format: string, delimiter: string): Date {
    const formatLowerCase = format.toLowerCase();
    const formatItems = formatLowerCase.split(delimiter);
    const dateItems: string[] = date.split(delimiter);
    const monthIndex = formatItems.indexOf('mm');
    const dayIndex = formatItems.indexOf('dd');
    const yearIndex = formatItems.indexOf('yyyy');
    const month = parseInt(dateItems[monthIndex]) - 1;
    const formatedDate = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
    return formatedDate;
  }

  public static scrollTo(className: string): void {
    const elementList = document.querySelectorAll('.' + className);
    const element = elementList[0] as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth' });
  }

  public static roundDecimal(num: number, decimalPlaces: number): number {
    return parseFloat(num.toFixed(decimalPlaces));
  }

  public static isValidDate(dateObj: any): boolean {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
    return date instanceof Date && !isNaN(date.getTime());
  }

  public static getApiError(error: any): string {
    if (!this.isUndefinedOrNull(error) && !this.isUndefinedOrNull(error.errors)) {
      return error.errors[0].message;
    }
    return '';
  }

  public static getWebsiteBaseUrl(): string {
    let websiteOrigin = '';

    // window.location.origin is not supported in legacy browsers
    if (!window.location.origin) {
      websiteOrigin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    } else {
      websiteOrigin = window.location.origin;
    }
    return websiteOrigin;
  }

  public static getUniqueItemsArray(items: any[], key: string): any[] {
    return [
      ...items
        .reduce((uniqueItems, item) => {
          if (!uniqueItems.has(item[key])) {
            uniqueItems.set(item[key], item);
          }
          return uniqueItems;
        }, new Map())
        .values(),
    ];
  }

  public static toTitleCase(str: string): string {
    return str
      .split(' ')
      .map((val) => {
        return val[0].toUpperCase() + val.substring(1).toLowerCase();
      })
      .join(' ');
  }

  public static formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * This method sorts the provided JSON object on the name key.
   * @param jsonObject
   * @param sortOrder either asc | desc
   * @returns sorted json object based on the provided sortOrder
   */
  public static sortJsonObjectByNameKey(jsonObject: any, sortOrder: string): any {
    const compareFunction = (a: any, b: any) => {
      const result = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      return sortOrder === 'asc' ? result : -result;
    };

    if (Array.isArray(jsonObject)) {
      return jsonObject.map((item: any) => this.sortJsonObjectByNameKey(item, sortOrder)).sort(compareFunction);
    } else if (jsonObject !== null && typeof jsonObject === 'object') {
      return Object.fromEntries(
        Object.entries(jsonObject)
          .map(([key, value]) => [key, this.sortJsonObjectByNameKey(value, sortOrder)])
          .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }))
      );
    }
    return jsonObject;
  }

  public static hasValidExtension(fileName: string, allowedExtensions: string[]) {
    return new RegExp('(' + allowedExtensions.join('|').replace(/\./g, '\\.') + ')$', 'i').test(fileName);
  }

  public static getCurrentTimestamp(): string {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const hours = String(currentDate.getUTCHours()).padStart(2, '0');
    const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  public static getRouteByPageName(pageName: string): string {
    const routesMapper: any = constants.routesMapper;
    if (!this.isUndefinedOrNull(routesMapper[pageName])) {
      return routesMapper[pageName];
    }
    return pageName;
  }
}
