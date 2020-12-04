import { Component, OnInit } from '@angular/core';
import { IntegromatService } from 'src/app/services/integromat.service';
import { SessionServiceService } from 'src/app/services/session-service.service';

@Component({
  selector: 'app-choose-prescription',
  templateUrl: './choose-prescription.component.html',
  styleUrls: ['./choose-prescription.component.css']
})


export class ChoosePrescriptionComponent implements OnInit {

  constructor(
    private sessionService : SessionServiceService,
    private integromatSerivce : IntegromatService
  ) { }

  ngOnInit(): void {

    this.integromatSerivce.getPrescriptionsForCustomer(1).subscribe((data) => {
      console.log(data);
    });
  }



}
