import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, shareReplay, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  user$!: Observable<User>;
  post$!: Observable<Post>;
  userId!: string;


  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.params['id'];
    this.post$ = this.postService.getPostById(postId);
  }

  onModifyButton() {
    const userId = localStorage.getItem('userId');
    const admin = localStorage.getItem('admin');
    return userId === this.post.userId || admin === 'true';
  }

  onClickPost(postId: string) {
    this.router.navigateByUrl(`posts/${this.post._id}`);
  }

  onGetPostLikes() {
    const userId = localStorage.getItem('userId');
    return this.post.usersLiked.includes(userId!);
  }

  onLikes(postId: string): void {
    const userId = localStorage.getItem('userId');
    const userLike = this.post.usersLiked.includes(userId!);
    console.log(postId);
    console.log(userLike);
      this.postService.postLikebyId(postId, !userLike).pipe(
        tap((post) => {
          console.log(post);
          console.log("blablablaa");
          this.post = post;
        })
      ).subscribe();  
    }   
}
