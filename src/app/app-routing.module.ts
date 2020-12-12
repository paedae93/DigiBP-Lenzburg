import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ChoosePrescriptionComponent } from './components/choose-prescription/choose-prescription.component';
import { SelectPaymentComponent } from './components/select-payment/select-payment.component';
import { SelectProductComponent } from './components/select-product/select-product.component';
import { SymptomsComponent } from './components/symptoms/symptoms.component';
import { TakePrescriptionComponent } from './components/take-prescription/take-prescription.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full'},
  { path: 'welcome', component: WelcomeComponent},
  { path: 'Activity_0pwk0ja', component: TakePrescriptionComponent},
  { path: 'Activity_06kwk7g', component: ChoosePrescriptionComponent },
  { path: 'Activity_0ul4i93', component: SelectProductComponent },
  { path: 'Activity_0e6veoe', component: SymptomsComponent },
  { path : 'Activity_0v33c4r', component: SelectPaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
