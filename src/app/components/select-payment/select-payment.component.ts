import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/classes/Order';
import { SessionData } from 'src/app/classes/SessionData';
import { CamundaRestService } from 'src/app/services/camunda-rest.service';
import { IntegromatService } from 'src/app/services/integromat.service';
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
    private integromatService : IntegromatService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  payment(method : String){
    this.sessionService.setLoading(true);
    this.sessionService.sessionData.status = "Process payment...";

    let order = new Order();
    order.payment_method = method;
    order.status = "closed";
    order.business_key = this.sessionService.sessionData.businesskey;

    this.camundaRestService.postCompleteTask(this.sessionService.sessionData.actualTaskID, "").subscribe((data) => {
      this.sessionService.sessionData.status = "Payment successful. Task completed. Update Order....";

      this.integromatService.updateOrder(order).subscribe((data) => {

        this.sessionService.sessionData.status = "Order updated. Get next Task...";

        this.sessionService.clearSession();
        this.sessionService.setLoading(false);
        this.router.navigate(['/welcome']);
      });
    });
  }

}
