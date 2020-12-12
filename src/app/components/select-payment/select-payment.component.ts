import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionData } from 'src/app/classes/SessionData';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent implements OnInit {

  constructor(
    private camundaRestService : CamundaRestService,
    private sessionService : SessionServiceService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  payment(method : String){
    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Process payment...";

    this.camundaRestService.postCompleteTask(this.sessionService.sessionData.actualTaskID, "").subscribe((data) => {
      this.sessionService.sessionData.status = "Payment successful. Task completed. Get next task....";
      this.camundaRestService.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe((data)=>{

        if(data[0].taskDefinitionKey == 'Activity_16il0x1'){
          this.camundaRestService.postCompleteTask(data[0].id, "").subscribe((data) => {

            this.sessionService.clearSession();

            this.router.navigate(['/welcome']);
            
          })
        }else{
          this.sessionService.sessionData.actualTaskID = data[0].id;
          this.sessionService.sessionData.actualTaskName = data[0].name;
          this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;
  
          this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]); 
        }

        this.sessionService.setLoading(false);
      });
    });
  }

}
