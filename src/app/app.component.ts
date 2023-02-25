import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  strongPassword = false;

  passCheckForm = new FormGroup({
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ]),
  });

  get f() {
    return this.passCheckForm.controls;
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}
