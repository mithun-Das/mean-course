import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule,
         MatCardModule,
         MatButtonModule,
         MatToolbarModule,
         MatExpansionModule 
       } from '@angular/material';
      

import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { TestComponent } from './../test/test.component';
//import { PostService } from './posts/post.service';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostCreateComponent,
    TestComponent,
    HeaderComponent
  ],
  imports: [

    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
