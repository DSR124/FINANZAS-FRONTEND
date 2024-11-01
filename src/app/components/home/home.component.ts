import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet  ,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

}
