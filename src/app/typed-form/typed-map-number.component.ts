import { Component } from '@angular/core';
import { TypedMapComponent } from './typed-map.component';

@Component({
  selector: 'app-typed-map-number',
  templateUrl: './typed-map.component.html',
  styleUrls: ['./typed-map.component.scss'],
})
export class TypedMapNumberComponent extends TypedMapComponent<number> {}