import { Component } from '@angular/core';
import { TypedArrayComponent } from './typed-array.component';

@Component({
  selector: 'app-typed-array-string',
  templateUrl: './typed-array.component.html',
  styleUrls: ['./typed-array.component.scss'],
})
export class TypedArrayStringComponent extends TypedArrayComponent<string> {}
