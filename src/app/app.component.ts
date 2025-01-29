import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuespedComponent } from './componentes/huesped/huesped.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'comando2';
}
