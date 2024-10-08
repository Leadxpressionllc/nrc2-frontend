import { ComponentRef, Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nrcLoader]',
  standalone: true,
})
export class LoaderDirective implements OnInit {
  @Input() nrcLoader = 'primary';

  componentRef: ComponentRef<NgxSpinnerComponent>;

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.componentRef = this.viewContainerRef.createComponent(NgxSpinnerComponent);
    this.renderer.appendChild(this.el.nativeElement, this.componentRef.location.nativeElement);
  }

  ngOnInit(): void {
    this.componentRef.instance.type = 'ball-scale-multiple';
    this.componentRef.instance.size = 'medium';
    this.componentRef.instance.color = '#00ba37';
    this.componentRef.instance.bdColor = 'rgba(255, 255, 255, 0.85)';
    this.componentRef.instance.fullScreen = false;

    if (this.nrcLoader) {
      this.componentRef.instance.name = this.nrcLoader;
    }
  }
}
