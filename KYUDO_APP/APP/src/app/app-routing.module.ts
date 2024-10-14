import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { Interface2Component } from './components/interface2/interface2.component';
import { Interface3Component } from './components/interface3/interface3.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'tracking', component: TrackingComponent },
  { path: 'sign', component: Interface2Component },
  { path: 'scan', component: Interface3Component },
  { path: '**', redirectTo: 'home' } // Redirect any other route to home
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
