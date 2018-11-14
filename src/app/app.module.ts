import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';  // For template driven form
import { ReactiveFormsModule } from '@angular/forms'; // For reactive driven form
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { TestComponent } from './../test/test.component';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { AuthInterceptor } from './auth/auth-interceptor';

import { from } from 'rxjs';
//import { PostService } from './posts/post.service';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostCreateComponent,
    TestComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,   // For template driven form
    ReactiveFormsModule, // For Reactive driven form
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [{ provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
