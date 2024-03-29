// foto.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrls: ['./foto.component.css'],
})
export class FotoComponent {
  @Input() fotoUrl!: string | null;
}
