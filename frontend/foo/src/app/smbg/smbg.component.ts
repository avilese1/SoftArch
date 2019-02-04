import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-smbg',
  templateUrl: './smbg.component.html',
  styleUrls: ['./smbg.component.css']
})
export class SmbgComponent {
  smbg = new FormControl('');
}
