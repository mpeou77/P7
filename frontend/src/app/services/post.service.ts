import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  tap,
  map,
  switchMap,
} from 'rxjs';
import { PostListComponent } from '../post-list/post-list.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  likeType!: boolean;

  constructor(private http: HttpClient,
              private auth: AuthService  ) {}

  

  getAllPosts(): Observable<Post[]> {
    
    return this.http.get<Post[]>('http://localhost:3000/api/posts');
  }

  getPostById(postId: string): Observable<Post> {
    return this.http.get<Post>(`http://localhost:3000/api/posts/${postId}`);
  }

  createPost(post: any, imageUrl: File) {
    const formData = new FormData();
    formData.append('post', post);
    formData.append('imageUrl', imageUrl);
    return this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  modifyPost(id: string, post: any, image: string | File) {
    
      const formData = new FormData();
      formData.append('feeling', post);
      console.log('touttout');
      if(image != null) {
      formData.append('imageUrl', image);
      }
      return this.http
        .put<{ message: string }>(
          'http://localhost:3000/api/posts/' + id,
          formData
        )
        .pipe(catchError((error) => throwError(error.error.message)));
    
  }

  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  postLikebyId(postId: string, likeType: boolean): Observable<Post> { 
    console.log(likeType);
    console.log('mercredi');
      return this.http
        .put<Post>(
          `http://localhost:3000/api/posts/ ${ postId }/like`,
          { userId: this.auth.getUserId() , likes: likeType  ? 0 : 1 }
        )
        .pipe(catchError((error) => throwError(error.error.message)));
    
  }
  
}
