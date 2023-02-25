import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})
export class PasswordStrengthComponent implements OnChanges {
  bar0: string = '';
  bar1: string = '';
  bar2: string = '';

  @Input() public passwordToCheck: any;

  @Output() passwordStrength = new EventEmitter<boolean>();

  private colors = ['darkred', 'yellow', 'green'];

  message: string = '';
  messageColor: string = '';

  checkStrength(password: string) {
    let passwordForce = 0;

    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const letters = /[A-Za-z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    const flags = [letters, numbers, symbols];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    passwordForce += 2 * password.length + (password.length >= 10 ? 1 : 0);
    passwordForce += passedMatches * 10;

    passwordForce = password.length <= 6 ? Math.min(passwordForce, 10) : passwordForce;

    passwordForce = passedMatches === 1 ? Math.min(passwordForce, 10) : passwordForce;
    passwordForce = passedMatches === 2 ? Math.min(passwordForce, 20) : passwordForce;
    passwordForce = passedMatches === 3 ? Math.min(passwordForce, 30) : passwordForce;

    return passwordForce;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;

    this.setBarColors(3, '#DDD');

    if (password) {
      const pwdStrength = this.checkStrength(password);
      pwdStrength === 30
        ? this.passwordStrength.emit(true)
        : this.passwordStrength.emit(false);

      const color = this.getColor(pwdStrength);
      this.setBarColors(color.index, color.color);

      if (password.length < 8) {
        this.setBarColors(3, '#8b0000');
      } else {
        switch (pwdStrength) {
          case 10:
            this.message = 'Easy';
            break;
          case 20:
            this.message = 'Medium';
            break;
          case 30:
            this.message = 'Strong';
            break;
        }
      }
    } else {
      this.message = '';
    }
  }

  private getColor(strength: number) {
    let index = 0;

    if (strength === 10) {
      index = 0;
    } else if (strength === 20) {
      index = 1;
    } else if (strength === 30) {
      index = 2;
    } else {
      index = 3;
    }

    this.messageColor = this.colors[index];

    return {
      index: index + 1,
      color: this.colors[index],
    };
  }

  private setBarColors(count: number, color: string) {
    for (let n = 0; n < count; n++) {
      (this as any)['bar' + n] = color;
    }
  }
}
