import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  urlDeLaFoto: string | null = null;
  ubicacion: { latitud: number; longitud: number } | null = null;

  cargarImagen(url: string): void {
    this.urlDeLaFoto = url;
  }

  onUbicacionSeleccionada(ubicacion: {
    latitud: number;
    longitud: number;
  }): void {
    this.ubicacion = ubicacion;
  }
  title = 'client';
}
