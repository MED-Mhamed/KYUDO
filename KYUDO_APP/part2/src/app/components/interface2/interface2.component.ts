import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-interface2',
  templateUrl: './interface2.component.html',
  styleUrls: ['./interface2.component.scss'],
})
export class Interface2Component implements OnInit {
  authForm: FormGroup
  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      phone: ['', Validators.required],
      password: ['', Validators.required],

    });
  }
  submitForm() {
    console.log(this.authForm.value);

  }

}
