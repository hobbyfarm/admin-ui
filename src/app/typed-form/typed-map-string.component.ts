import { Component } from '@angular/core';
import { TypedMapComponent } from './typed-map.component';

@Component({
  selector: 'app-typed-map-string',
  templateUrl: './typed-map.component.html',
  styleUrls: ['./typed-map.component.scss'],
})
export class TypedMapStringComponent extends TypedMapComponent<string> {}
