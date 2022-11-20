import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo,} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);

// const routes: Routes = [
//   {
//     path: '',
//     pathMatch: 'full',
//     component: LoginComponent,
//   },
//   {
//     path: 'login',
//     component: LoginComponent,
//     ...canActivate(redirectToHome),
//   },
//   {
//     path: 'sign-up',
//     component: SignUpComponent,
//     ...canActivate(redirectToHome),
//   },
//   {
//     path: 'home',
//     component: HomeComponent,
//     ...canActivate(redirectToLogin),
//   },
//   {
//     path: 'profile',
//     component: ProfileComponent,
//     ...canActivate(redirectToLogin),
//   },
// ];

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }, 
  { path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule) }, 
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) }, 
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'post', loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule) }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
