import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PaddleComponent } from './components/paddle/paddle.component';
import { BallComponent } from './components/ball/ball.component';
import { StoreModule } from '@ngrx/store';
import { paddleReducer } from './store/paddle/paddle.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BricksComponent } from './components/bricks/bricks.component';
import { BrickComponent } from './components/brick/brick.component';
import { ballReducer } from './store/ball/ball.reducer';
import { DropBonusComponent } from './components/drop-bonus/drop-bonus.component';
import { bricksReducer } from './store/bricks/bricks.reducer';
import { ScoreComponent } from './components/score/score.component';
import { ColorChangeDirective } from './custom-directives/change-color.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalPopUpModule } from './shared/modal-pop-up/modalPopUp.module';
import { gameFlagsReducer } from './store/game/game.reducer';
import { SortListPipe } from './pipes/sort-list.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PaddleComponent,
    BallComponent,
    BricksComponent,
    BrickComponent,
    DropBonusComponent,
    ScoreComponent,
    ColorChangeDirective,
    SortListPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      paddle: paddleReducer,
      ball: ballReducer,
      bricks: bricksReducer,
      gameFlags: gameFlagsReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    BrowserAnimationsModule,
    FontAwesomeModule,
    ModalPopUpModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
