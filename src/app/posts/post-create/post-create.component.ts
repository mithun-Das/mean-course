import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { Post } from './../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostListComponent } from './../post-list/post-list.component';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from "./mime-type.validator";

@Component({
    selector : "./app-post-create",
    templateUrl : "./post-create.component.html",
    styleUrls : ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit{

    form : FormGroup; // For reactive driven form
    imagePreview : any;
    private mode = 'create';
    private postId : string;    
    public post: Post = {id : '', title : '', content : '',imagePath : ''};

  constructor(public postService : PostService, public route : ActivatedRoute) {  }  

// @Output()   postCreated = new EventEmitter<Post>();

        ngOnInit() {

            // For template driven form //

            this.form = new FormGroup({
                'title' : new FormControl(null, { validators : [Validators.required, Validators.minLength(3)] }),
                'content' : new FormControl(null, { validators : [Validators.required, Validators.minLength(3)] }),
                'image' : new FormControl(null, { validators : [Validators.required], asyncValidators : [mimeType]})
            });

            // End For template driven form //

            this.route.paramMap.subscribe( (paramMap : ParamMap) => {
                if(paramMap.has('postId')){
                    this.mode = 'edit';
                    this.postId = paramMap.get('postId');
                    this.postService.getPost(this.postId).subscribe((response) => {
                       this.post = {
                           id : response[0]._id,
                           title : response[0].title,
                           content : response[0].content,
                           imagePath : response[0].imagePath
                       }

                       this.form.setValue({
                           title : this.post.title,
                           content : this.post.content,
                           image : this.post.imagePath
                       });
                   });
                }else{
                    this.mode = 'create';
                    this.postId = null;
                    
                }
            });
        }

        onImagePicked(event : Event) {
            const file = (event.target as HTMLInputElement).files[0];
            this.form.patchValue({image : file});
            this.form.get('image').updateValueAndValidity();
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            }

            reader.readAsDataURL(file);
            console.log(file);
        }

        onSavePost() { //  onSavePost(form : NgForm)

            if(this.form.invalid){ // form.invalid
                return ;
            }

            const post : Post = {   id : "",
                                    title : this.form.value.title , 
                                    content : this.form.value.content,
                                    imagePath : ''
                                    
                                } ;

            // this.postCreated.emit(post);

            if(this.mode == "create"){
                this.postService.addPost( this.form.value.title,
                                          this.form.value.content,
                                          this.form.value.image
                                        );
            }else {
                this.postService.updatePost(this.postId,
                                            this.form.value.title,
                                            this.form.value.content,
                                            this.form.value.image
                                            );
            }

            this.form.reset();

        }
}