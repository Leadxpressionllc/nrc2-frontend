import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AppService } from '@core/utility-services';
import moment from 'moment';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

@Directive({
  selector: '[nrcTimeAgo]',
  standalone: true,
})
export class TimeAgoDirective implements OnInit {
  @Input()
  set nrcTimeAgo(nrcTimeAgo: Date) {
    const date = nrcTimeAgo;
    if (!AppService.isUndefinedOrNull(date)) {
      this.setContent(this.el.nativeElement, this._formatDate(date));
    }
  }

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  setContent(node: any, content: string): void {
    node.textContent = content;
  }

  _formatDate(then: Date): string {
    const now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    const [value, unit]: [string, string] =
      moment(now).diff(then, 'second') < MINUTE
        ? ['Now', '']
        : moment(now).diff(then, 'second') < HOUR
          ? [moment(now).diff(then, 'minute').toString(), 'minute']
          : moment(now).diff(then, 'second') < DAY
            ? [moment(now).diff(then, 'hour').toString(), 'hour']
            : [moment(now).diff(then, 'day').toString(), 'day'];

    return value + ' ' + unit + (unit !== '' && value !== '1' ? 's' : '') + (unit !== '' ? ' ago' : '');
  }
}
