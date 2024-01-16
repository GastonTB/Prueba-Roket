// mapa.component.ts
import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit, OnChanges {
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  // Recibir coordenadas como entrada
  @Input() ubicacion: { latitud: number; longitud: number } | null = null;

  private initMap(): void {
    // Inicializar el mapa si aún no se ha hecho
    if (!this.map) {
      this.map = L.map('map', {
        center: this.ubicacion
          ? [this.ubicacion.latitud, this.ubicacion.longitud]
          : [-33.4489, -70.6693],
        zoom: 5,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        this.map
      );

      // Agregar marcador inicial si hay ubicación
      if (this.ubicacion) {
        this.marker = L.marker([
          this.ubicacion.latitud,
          this.ubicacion.longitud,
        ]).addTo(this.map);
      }
    }
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si hay cambios en las coordenadas, actualizar el mapa
    if (changes['ubicacion'] && !changes['ubicacion'].firstChange) {
      this.updateMap();
    }
  }

  private updateMap(): void {
    if (this.map && this.ubicacion) {
      // Centrar el mapa en las nuevas coordenadas
      this.map.setView([this.ubicacion.latitud, this.ubicacion.longitud], 20);

      // Actualizar la posición del marcador
      if (this.marker) {
        this.marker.setLatLng([
          this.ubicacion.latitud,
          this.ubicacion.longitud,
        ]);
      } else {
        // Si no hay marcador, crear uno nuevo
        this.marker = L.marker([
          this.ubicacion.latitud,
          this.ubicacion.longitud,
        ]).addTo(this.map);
      }
    }
  }
}
