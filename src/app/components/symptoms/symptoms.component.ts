import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { IntegromatService } from 'src/app/services/integromat.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.css']
})
export class SymptomsComponent implements OnInit {

  customer_id = this.sessionService.sessionData.customer_id;

  constructor(
    private integromatSerivce : IntegromatService,
    private camundaRestService : CamundaRestService,
    private sessionService : SessionServiceService,
  ) { }

  ngOnInit(): void {
  }

  next(){
    this.integromatSerivce.getOrder().subscribe((data) => {
      if(data.product_id != null){

        this.sessionService.setLoading(true);
        this.sessionService.sessionData.status = "Order updated. Complete Task...";

        let vari = {
          variables : {
            Product_ID : {"value" : data.product_id},
            Prescription_ID : {"value" : "NONE"}
          }
        }

        this.camundaRestService.postCompleteTask(this.sessionService.sessionData.actualTaskID, JSON.stringify(vari)).subscribe((data) => {
          this.sessionService.sessionData.status = "Task completed. Get next Task...";

          this.camundaRestService.getNextTask();
        });
      }
    });
  }

}
