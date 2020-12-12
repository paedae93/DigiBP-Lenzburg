import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { $ } from 'protractor';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { Suggestion } from '../../classes/Suggestion';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css']
})
export class SelectProductComponent implements OnInit {

  suggestion : Suggestion[];
  displayedColumns: string[] = ['product_id', 'product_name', 'generic', 'amount', 'in_stock' , 'price'];
  dataSource : Suggestion[];

  constructor(
    private camundaRestSerivce : CamundaRestService,
    private sessionService : SessionServiceService,
    private router : Router,
  ) { 
    this.suggestion = [];
    this.dataSource = [];
  }

  ngOnInit(): void {

    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Load product suggetions...";

    this.camundaRestSerivce.getSuggestion(this.sessionService.sessionData.actualTaskID).subscribe((data) => {
      this.suggestion = JSON.parse(String(Object.values(data)[1])).suggestion;
      this.dataSource = this.suggestion;
      this.sessionService.setLoading(false);
    });
  }

  productChosen(row : any){

    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Set Product...";

    let vari = {
      variables : {
        selected_product_id : {"value" : Number(row.Product_ID)},
        amount : {"value" : Number(1)}
      }
    }

    this.camundaRestSerivce.postCompleteTask(this.sessionService.sessionData.actualTaskID, JSON.stringify(vari)).subscribe((data) => {
      this.sessionService.sessionData.status = "Order updated. Task completed...";
      this.camundaRestSerivce.getNextTask();
    });
  }

}

