import { NgModule } from '@angular/core';
import {    MatInputModule,
            MatCardModule,
            MatButtonModule,
            MatToolbarModule,
            MatExpansionModule,
            MatPaginatorModule,
            MatFormFieldModule,
            MatProgressSpinnerModule 
} from '@angular/material';



@NgModule({
    exports : [
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
    ]
})

export class AngularMaterialModule {

}
