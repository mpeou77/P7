import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  postForm!: FormGroup;
  errorMsg!: string;
  mode!: string;
  post!: Post;
  imagePreview!: string;

  constructor(
    private formBuilder: FormBuilder,
    private posts: PostService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group(
      {
        feeling: [null, Validators.required],
        imageUrl: [null, Validators.required],
      },
      {
        updateOn: 'blur',
      }
    );

    this.route.params
      .pipe(
        switchMap((params) => {
          if (!params['id']) {
            this.mode = 'new';
            this.initEmptyForm();
            return EMPTY;
          } else {
            this.mode = 'edit';
            return this.posts.getPostById(params['id']);
          }
        }),
        tap((post) => {
          if (post) {
            this.post = post;
            this.initModifyForm(post);
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      feeling: [null, Validators.required],
      imageUrl: [null, Validators.required],
    });
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      feeling: [post.feeling, Validators.required],
      imageUrl: [post.imageUrl, Validators.required],
    });
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.postForm.patchValue({
      imageUrl: file,
    });
    this.postForm.get('imageUrl')!.updateValueAndValidity();
  }

  onSubmitForm() {
    const feeling = this.postForm.get('feeling')!.value;
    const imageUrl = this.postForm.get('imageUrl')!.value;

    if (this.mode === 'new') {
      this.posts
        .createPost(feeling, imageUrl)
        .pipe(
          tap(() => {
            this.router.navigate(['/postList']);
          }),
          catchError((error) => {
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    } else if (this.mode === 'edit') {
      console.log(this.post._id);
      console.log('croyance');
      this.posts.modifyPost(this.post._id,feeling, imageUrl).pipe(
        tap(() => {
          this.router.navigate(['/postList']);
          }),
          catchError((error) => {
            this.errorMsg = error.message;
            return EMPTY;
        })
      ).subscribe();
    }

  }

  onAllPost(): void {
    this.router.navigateByUrl('/postList');
  }
}
