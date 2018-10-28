import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn : 'root'})

export class PostService {

    private posts : Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private http : HttpClient) {
    
    }

    getPosts() {
        //return this.posts;
        // return [...this.posts];

        this.http.get<{message : String, posts : Post[]}>('http://localhost:3000/api/posts')
                 .subscribe((response) => {
                        this.posts = response.posts;
                        this.postUpdated.next([...this.posts]);
                 });
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(title : string, content : string) {
        const post = {title : title, content : content};
        this.http.post<{message : String}>('http://localhost:3000/api/posts',post).subscribe((response) => {
            console.log(response.message);
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);    
        })
    }

}