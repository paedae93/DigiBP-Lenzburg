import { RowContext } from '@angular/cdk/table';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prescription } from 'src/app/classes/Prescription';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { IntegromatService } from 'src/app/services/integromat.service';
import { SessionServiceService } from 'src/app/services/session-service.service';
import { runInNewContext } from 'vm';


@Component({
  selector: 'app-choose-prescription',
  templateUrl: './choose-prescription.component.html',
  styleUrls: ['./choose-prescription.component.css']
})


export class ChoosePrescriptionComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'Doctor', 'Symptoms', 'Product'];
  dataSource : Prescription[];


  constructor(
    private sessionService : SessionServiceService,
    private integromatSerivce : IntegromatService,
    private camundaRESTService : CamundaRestService,
    private router : Router
  ) { 
    this.dataSource = [];
  }

  ngOnInit(): void {

    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Load Prescriptions...";

    this.integromatSerivce.getPrescriptionsForCustomer(this.sessionService.sessionData.customer_id).subscribe((data) => {
      this.dataSource = data;
      this.sessionService.setLoading(false);
    });

    
  }

  prescriptionChosen(row : PrescriptionRow){
    let chosenRow : PrescriptionRow = row;

    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Set Prescriptions...";

    this.integromatSerivce.updateOrderPrescription(row.ID).subscribe((data) => {

      this.sessionService.sessionData.status = "Order Updated. Complete Task...";

      let vari = {
        variables : {
          Prescription_ID : {"value" : Number(row.ID)},
          Product_ID : {"value" : Number(row.Product_ID)}
        }
      };

      this.sessionService.sessionData.in_progress = true;
      this.camundaRESTService.postCompleteTask(this.sessionService.sessionData.actualTaskID, JSON.stringify(vari)).subscribe((data) => {
        this.camundaRESTService.getNextTask();
      })
    });
  }

}

export interface PrescriptionRow{
  ID : number;
  Doctor_ID: number;
  Symptoms: string;
  Product_ID: number;
}

export class PrescriptionComplete{
  prescription_id : number = 0;
  Product_ID : number = 0;
}
