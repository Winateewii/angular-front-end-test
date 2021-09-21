import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDetail } from 'app/api/api.models';
import { EmployeeComponent } from '../employee/employee.component'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  modalDetail: ModalDetail[] = []
  
  constructor() { }

  ngOnInit() {
  }
  @ViewChild('myModal') modal: ElementRef;


  open(modalDetail) {
    this.modalDetail = modalDetail
    this.modal.nativeElement.style.display = 'block';
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }

}
