import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { ProfileListComponent } from './components/profiles/profile-list/profile-list.component';
import { ProfileFormComponent } from './components/profiles/profile-form/profile-form.component';
import { ProfileDetailComponent } from './components/profiles/profile-detail/profile-detail.component';
import { authGuard } from './guards/auth.guard';
import { sectionGuard } from './guards/section.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductListComponent, canActivate: [sectionGuard], data: {section: 'products'}, },
      { path: 'products/new', component: ProductFormComponent, canActivate: [sectionGuard], data: {section: 'products'},},
      { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [sectionGuard], data: {section: 'products'},},
      { path: 'users', component: UserListComponent,canActivate: [sectionGuard], data: {section: 'users'}, },
      { path: 'users/new', component: UserFormComponent, canActivate: [sectionGuard], data: {section: 'users'}, },
      { path: 'users/edit/:id', component: UserFormComponent, canActivate: [sectionGuard], data: {section: 'users'}, },
      { path: 'users/detail/:id', component: UserDetailComponent, canActivate: [sectionGuard], data: {section: 'users'}, },
      { path: 'profiles', component: ProfileListComponent,canActivate: [sectionGuard], data: {section: 'profiles'}, },
      { path: 'profiles/new', component: ProfileFormComponent, canActivate: [sectionGuard], data: {section: 'profiles'}, },
      { path: 'profiles/edit/:id', component: ProfileFormComponent, canActivate: [sectionGuard], data: {section: 'profiles'}, },
      { path: 'profiles/detail/:id', component: ProfileDetailComponent, canActivate: [sectionGuard], data: {section: 'profiles'}, },
    ],
  },
  { path: '**', redirectTo: '/login' },
];