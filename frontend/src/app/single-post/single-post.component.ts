import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { catchError, EMPTY, Observable, switchMap, take, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit {
  post$!: Observable<Post>;
  errorMessage: any;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    this.post$ = this.postService.getPostById(postId);
  }

  onBack() {
    this.router.navigate(['/postList']);
  }

  onModify() {
    this.post$
      .pipe(tap((post) => this.router.navigate(['/modifyPost', post._id])))
      .subscribe();
  }

  onDelete() {
    this.post$
      .pipe(
        switchMap((post) => this.postService.deletePost(post._id)),
        tap((message) => {
          this.router.navigate(['/postList']);
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          console.error(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
