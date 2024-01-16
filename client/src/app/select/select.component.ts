// select.component.ts

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Output() fotoSeleccionada: EventEmitter<any> = new EventEmitter<any>();
  @Output() ubicacionSeleccionada: EventEmitter<any> = new EventEmitter<any>();

  arboles: any[] = []; // Aquí se almacenará la lista de árboles
  selectedArbol: number | null = null; // Almacena el ID del árbol seleccionado

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // Realiza una solicitud HTTP al servidor para obtener la lista de árboles
    this.httpClient.get<any[]>('http://localhost:3000/arboles').subscribe(
      (data) => {
        this.arboles = data;
      },
      (error) => {
        console.error('Error al obtener la lista de árboles:', error);
      }
    );
  }

  // Llamado cuando se selecciona un árbol
  onSelectArbol(event: any): void {
    const selectedValue = event.target.value;
    console.log('ID del árbol seleccionado:', selectedValue);

    // Realizar una solicitud HTTP al servidor para obtener la foto del árbol específico
    this.httpClient
      .get<any>(`http://localhost:3000/fotos?arbolId=${selectedValue}`)
      .subscribe(
        (foto) => {
          // Emitir el evento con la URL de la foto
          this.fotoSeleccionada.emit(foto.url_foto);
        },
        (error) => {
          console.error('Error al obtener la foto del árbol:', error);
        }
      );

    this.httpClient
      .get<any>(`http://localhost:3000/arboles/${selectedValue}`)
      .subscribe(
        (arbol) => {
          // Verificar si se encontró el árbol
          if (!arbol) {
            console.error(
              'No se encontró información para el árbol seleccionado.'
            );
            return;
          }

          // Imprimir la información del árbol en la consola
          console.log('Información del árbol:', arbol);

          // Realizar una solicitud HTTP al servidor para obtener la información de la ubicación
          this.httpClient
            .get<any>(`http://localhost:3000/ubicaciones/${selectedValue}`)
            .subscribe(
              (ubicacion) => {
                // Verificar si se encontró la ubicación
                if (!ubicacion) {
                  console.error(
                    'No se encontró información para la ubicación del árbol.'
                  );
                  return;
                }

                // Imprimir la información de la ubicación en la consola
                console.log(
                  'Información de la ubicación del árbol:',
                  ubicacion
                );

                //Exportar latitud y longitud
                // Emitir el evento con la latitud y longitud de la ubicación
                if (ubicacion && ubicacion.latitud && ubicacion.longitud) {
                  this.ubicacionSeleccionada.emit({
                    latitud: ubicacion.latitud,
                    longitud: ubicacion.longitud,
                  });
                  console.log('Evento ubicacionSeleccionada emitido con éxito');
                } else {
                  console.error('Ubicación no definida o faltan propiedades.');
                }
              },
              (error) => {
                console.error(
                  'Error al obtener la ubicación del árbol:',
                  error
                );
              }
            );
        },
        (error) => {
          console.error('Error al obtener la información del árbol:', error);
        }
      );
  }
}
