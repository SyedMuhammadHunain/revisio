import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-side-header',
  imports: [],
  templateUrl: './side-header.component.html',
  styleUrl: './side-header.component.css'
})
export class SideHeaderComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('.image-container');
    const img = this.el.nativeElement.querySelector('img');

    container.addEventListener('mousemove', (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = ((y / height) - 0.5) * 20; // tilt intensity
      const rotateY = ((x / width) - 0.5) * -20;

      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
      img.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
}
