import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-take-prescription',
  templateUrl: './take-prescription.component.html',
  styleUrls: ['./take-prescription.component.css']
})
export class TakePrescriptionComponent implements OnInit {

  constructor(
    private camundaRest : CamundaRestService,
    private sessionService : SessionServiceService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  proceed(answer: boolean){
    var vari = {variables:{Order_Prescribed_Product:{"value":answer}}};


      console.log(JSON.stringify(vari));
    this.camundaRest.postCompleteTask(this.sessionService.sessionData.actualTaskID, vari).subscribe(() => {
      this.camundaRest.getTaskOfProcessInstanceById(this.sessionService.sessionData.processInstanceID).subscribe({
        next : data => {

          this.sessionService.sessionData.actualTaskID = data[0].id;
          this.sessionService.sessionData.actualTaskName = data[0].name;
          this.sessionService.sessionData.actualTaskDefinitionKey = data[0].taskDefinitionKey;

          this.router.navigate(['/' + this.sessionService.sessionData.actualTaskDefinitionKey]);
          
        }
      });
    });
  }

}
