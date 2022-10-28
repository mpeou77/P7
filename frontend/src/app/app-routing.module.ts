import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPostComponent } from './new-post/new-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { SignupComponent } from './auth/signup/signup.component';

import { AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import { SinglePostComponent } from './single-post/single-post.component';

const routes: Routes = [
  
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'modifyPost/:id', component: NewPostComponent, canActivate: [AuthGuard] },
  {path: 'posts/:id',component: SinglePostComponent, canActivate: [AuthGuard]},
  { path: 'postList', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: NewPostComponent, canActivate: [AuthGuard] },
  
  { path: '', component: LoginComponent },
  //{ path:'**', redirectTo: 'posts'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
