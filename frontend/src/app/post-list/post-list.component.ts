import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: Post[];
  isAuth$!: Observable<boolean>;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((posts) => (this.posts = posts));
    this.isAuth$ = this.auth.isAuth$.pipe(shareReplay(1));
  }

  onAddNewPost(): void {
    this.router.navigateByUrl('/create');
  }
}
