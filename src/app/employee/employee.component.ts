import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee, PVFDetail, ModalDetail } from 'app/api/api.models';
import { employeesJson } from '../api/mock-employees'
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  birthdate: Date;
  yearDif: number;
  employees: Employee[] = []
  pvfDetail: PVFDetail[] = []
  modalDetail: ModalDetail
  yearExperience: number
  currentDate: string
  interestRate: number = 2
  companyPVDRate: number = 10
  @ViewChild('modal') modal: ModalComponent


  constructor() { }

  ngOnInit() {
    this.refreshEmployees()
    this.employees.forEach(employee => {
      this.preparePVFInfo(employee)
    })
    this.currentDate = new Date().getDate().toString() + '/' + (new Date().getMonth() + 1).toString() + '/' + new Date().getFullYear().toString()
  }

  refreshEmployees() {
    this.employees = employeesJson
  }

  getAge(date) {
    if (date) {
      date = this.convertDateFormat(date)
      var timeDif = Math.abs(Date.now() - new Date(date).getTime());
      this.yearDif = Math.floor(timeDif / (1000 * 3600 * 24) / 365);
      return this.yearDif
    }

  }

  getYearDif(date) {
    if (date) {
      date = this.convertDateFormat(date)
      var month = (new Date().getMonth() - new Date(date).getMonth()) +
        (12 * (new Date().getFullYear() - new Date(date).getFullYear()))
      return month - 3
    }

  }

  convertDateFormat(date) {
    var splitted = date.split("/", 3);
    return splitted[1] + '/' + splitted[0] + '/' + splitted[2]
  }

  convertFormatToCurrency(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }

  getTimeUnit(type) {
    if ('Permanent' == type) {
      return 'Baht/Month.'
    } else {
      return 'Baht/Hour.'
    }
  }

  preparePVFInfo(employeeInfo) {
    var monthExperience = this.getYearDif(employeeInfo.startdate)
    if (monthExperience >= 3 && employeeInfo.employeetype == 'Permanent') {
      var employeeContribution = employeeInfo.salary * employeeInfo.pvfrate * monthExperience * 0.01
      var companyContribution = employeeInfo.salary * this.companyPVDRate * monthExperience * 0.01
      var employeeBenefit = employeeContribution * this.interestRate * 0.01
      var companyBenefit = companyContribution * this.interestRate * 0.01
      this.pvfDetail.push({
        employeeid: employeeInfo.employeeid,
        monthExperience: monthExperience,
        employeeContribution: employeeContribution,
        companyContribution: companyContribution,
        employeeBenefit: employeeBenefit,
        companyBenefit: companyBenefit

      })
    }
    else {
      this.pvfDetail.push({
        employeeid: employeeInfo.employeeid,
        monthExperience: monthExperience,
        employeeContribution: 0,
        companyContribution: 0,
        employeeBenefit: 0,
        companyBenefit: 0

      })
    }
  }


  getEmployeeContribution(employeeid) {
    return this.convertFormatToCurrency(this.pvfDetail.find(pvd => pvd.employeeid == employeeid).employeeContribution)
  }

  getCompanyContribution(employeeid) {
    return this.convertFormatToCurrency(this.pvfDetail.find(pvd => pvd.employeeid == employeeid).companyContribution)
  }

  getEmployeeBenefit(employeeid) {
    return this.convertFormatToCurrency(this.pvfDetail.find(pvd => pvd.employeeid == employeeid).employeeBenefit)
  }

  getCompanyBenefit(employeeid) {
    return this.convertFormatToCurrency(this.pvfDetail.find(pvd => pvd.employeeid == employeeid).companyBenefit)
  }

  getTotalBalance(employeeid) {
    var pvdDetailTemp = this.pvfDetail.find(pvd => pvd.employeeid == employeeid)
    return this.convertFormatToCurrency(pvdDetailTemp.companyContribution + pvdDetailTemp.companyBenefit + pvdDetailTemp.employeeContribution + pvdDetailTemp.companyBenefit)

  }

  openPVDDetail(employeeInfo) {
    var pvdDetailTemp = this.pvfDetail.find(pvd => pvd.employeeid == employeeInfo.employeeid)
    var year = Math.floor(pvdDetailTemp.monthExperience / 12)
    var months = pvdDetailTemp.monthExperience % 12
    var yearMonthExperience = year + ' year ' + months + ' month(s)'
    var employeePortion = pvdDetailTemp.employeeContribution + pvdDetailTemp.employeeBenefit
    var companyPortionRate
    var companyPortion
    var total
    if (employeeInfo.employeetype == 'Permanent' && (months > 3 || year > 0)) {
      if (year < 3) {
        companyPortionRate = 0
        companyPortion = 0.00
        total = this.convertFormatToCurrency(companyPortion + employeePortion)
      } else if (year >= 3 && year < 5) {
        companyPortionRate = 50
        companyPortion = (pvdDetailTemp.companyContribution + pvdDetailTemp.companyBenefit) * companyPortionRate * 0.01
        total = this.convertFormatToCurrency(companyPortion + employeePortion)
      }
      else if (year >= 5) {
        companyPortionRate = 100
        companyPortion = pvdDetailTemp.companyContribution + pvdDetailTemp.companyBenefit
        total = this.convertFormatToCurrency(companyPortion + employeePortion)
      }
    }
    else {
      companyPortionRate = 0
      companyPortion = 0
      employeePortion = 0
      total = 0.00
    }


    this.modalDetail = {
      employeeid: employeeInfo.employeeid,
      yearMonthExperienceText: yearMonthExperience,
      fullName: employeeInfo.firstname + ' ' + employeeInfo.lastname,
      employeeType: employeeInfo.employeetype,
      startDate: employeeInfo.startdate,
      companyPortionRateTxt: companyPortionRate + '%',
      employeePortionTxt: this.convertFormatToCurrency(employeePortion),
      companyPortionTxt: this.convertFormatToCurrency(companyPortion),
      totalTxt: total,
      salaryTxt: this.convertFormatToCurrency(employeeInfo.salary) + ' ' + this.getTimeUnit(employeeInfo.employeetype)
    }
    this.modal.open(this.modalDetail);
  }


}
