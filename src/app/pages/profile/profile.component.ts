import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/interfaces/User/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  protected _user!: User

  constructor(
    private _userService: UserService
  ) { }
}
