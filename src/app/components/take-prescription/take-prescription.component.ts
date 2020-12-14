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
    this.sessionService.setLoading(false);
  }

  proceed(answer: boolean){
    var vari = {variables:{Order_Prescribed_Product:{"value":answer}}};
    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Complete Task...";

    this.camundaRest.postCompleteTask(this.sessionService.sessionData.actualTaskID, vari).subscribe(() => {
      this.sessionService.sessionData.status = "Task successfully completed.";

      this.camundaRest.getNextTask();
    });
  }

}
