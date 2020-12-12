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

    this.camundaRestSerivce.getSuggestion(this.sessionService.sessionData.actualTaskID).subscribe((data) => {
      this.suggestion = JSON.parse(String(Object.values(data)[1])).suggestion;
      this.dataSource = this.suggestion;
    });
  }

  productChosen(row : any){

    let vari = {
      variables : {
        selected_product_id : {"value" : Number(row.Product_ID)},
        amount : {"value" : Number(1)}
      }
    }

    this.camundaRestSerivce.postCompleteTask(this.sessionService.sessionData.actualTaskID, JSON.stringify(vari)).subscribe((data) => {
      this.camundaRestSerivce.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{

        this.sessionService.sessionData.actualTaskID = data[0].id;
        this.sessionService.sessionData.actualTaskName = data[0].name;
        this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

        this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);            

        this.sessionService.sessionData.in_progress = false;
      });
    });
  }

}

