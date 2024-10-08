import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nrc-layout1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss'],
})
export class Layout1Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
