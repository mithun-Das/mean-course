import { Component,EventEmitter,Output } from '@angular/core';
import { Post } from './../post.model';
import { NgForm } from '@angular/forms';

import { PostListComponent } from './../post-list/post-list.component';
import { PostService } from '../post.service';


@Component({
    selector : "./app-post-create",
    templateUrl : "./post-create.component.html",
    styleUrls : ["./post-create.component.css"]
})

export class PostCreateComponent {

  constructor(public postService : PostService) {}  

// @Output()   postCreated = new EventEmitter<Post>();

        onAddPost(form : NgForm) {

            if(form.invalid){
                return ;
            }

            const post : Post = {   title : form.value.title , 
                                    content : form.value.content
                                } ;

            // this.postCreated.emit(post);

            this.postService.addPost( form.value.title,form.value.content);
        }

        
}