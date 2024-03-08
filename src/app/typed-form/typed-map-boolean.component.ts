import { Component } from '@angular/core';
import { TypedMapComponent } from './typed-map.component';

@Component({
  selector: 'app-typed-map-boolean',
  templateUrl: './typed-map.component.html',
  styleUrls: ['./typed-map.component.scss'],
})
export class TypedMapBooleanComponent extends TypedMapComponent<boolean> {}