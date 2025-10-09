import { Component } from '@angular/core';
import { TypedArrayComponent } from './typed-array.component';

@Component({
  selector: 'app-typed-array-number',
  templateUrl: './typed-array.component.html',
  styleUrls: ['./typed-array.component.scss'],
})
export class TypedArrayNumberComponent extends TypedArrayComponent<number> {}
