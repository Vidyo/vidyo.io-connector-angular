import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    try {
    }
    catch (err) {
      console.error(err);
    }
  }
}
