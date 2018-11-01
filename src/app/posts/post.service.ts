import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { resolve } from 'path';


@Injectable({providedIn : 'root'})

export class PostService {

    private posts : Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private http : HttpClient) {
    
    }

    getPosts() {
        //return this.posts;
        // return [...this.posts];

        this.http.get<{message : String, posts : any}>('http://localhost:3000/api/posts')
                 .pipe(map((postData) => {
                    return postData.posts.map(post => {
                        return {
                            title : post.title,
                            content : post.content,
                            id : post._id
                        }
                    })                        
                 }))
                 .subscribe(transformedPosts => {
                        this.posts = transformedPosts ;
                        this.postUpdated.next([...this.posts]);
                 });
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(title : string, content : string) {
        var post = {id: "", title :  title, content : content};
        this.http.post<{message : String, data : any}>('http://localhost:3000/api/posts',post).subscribe((response) => {
            console.log(response.data);
            post.id = response.data._id; 
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);    
        })
    }

    deletePost(postId : string, index : any) {
       
        this.http.delete("http://localhost:3000/api/posts/" + postId)
                 .subscribe((response) => {
                    this.posts.splice(index,1);
                    this.postUpdated.next([...this.posts]);
                    return new Promise((resolve,reject) => {
                        resolve(response);
                        //reject("deletion failed");
                    });
                 });
    }

}