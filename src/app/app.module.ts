import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BricksContainerComponent } from './components/bricks-container/bricks-container.component';
import { BrickComponent } from './components/brick/brick.component';
import { HttpClientModule } from '@angular/common/http';
import { PaddleComponent } from './components/paddle/paddle.component';
import { BallComponent } from './components/ball/ball.component';

@NgModule({
  declarations: [
    AppComponent,
    BricksContainerComponent,
    BrickComponent,
    PaddleComponent,
    BallComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
