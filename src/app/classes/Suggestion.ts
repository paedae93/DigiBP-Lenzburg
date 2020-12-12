import { findLast } from '@angular/compiler/src/directive_resolver';

export class Suggestion{
    size : number = 0;
    generic: boolean = false;
    in_stock: boolean = false;
    product_id : number = 0;
    product_name : string = "";
    price : number = 0;
  }