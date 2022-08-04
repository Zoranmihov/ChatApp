import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  statement = false;

  ngOnInit(): void {
    console.log('Smth')
  }

}
