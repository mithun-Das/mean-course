
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl : './login.component.html',
    styleUrls : ['./login.component.css']
})

export class LoginComponent {

    constructor (private authService : AuthService) {
        
    }

    onLogin(form : NgForm) {
        this.authService.login(form.value.email , form.value.password)
    }

}