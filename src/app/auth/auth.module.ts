import { NgModule } from "@angular/core";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations : [
        LoginComponent,
        SignupComponent
    
    ],
    imports : [
        CommonModule,
        RouterModule,
        FormsModule,
        AuthRoutingModule,
        AngularMaterialModule
    ]
})

export class AuthModule {

}