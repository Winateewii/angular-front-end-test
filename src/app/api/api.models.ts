export class Employee {
    employeeid: number
    firstname: string
    lastname: string
    birthdate: string
    startdate: string
    employeetype: string
    salary: number
    pvfrate: number

}
export class PVFDetail {
    employeeid: number
    monthExperience: number
    employeeContribution: number
    companyContribution: number
    employeeBenefit: number
    companyBenefit: number
}

export class ModalDetail {
    employeeid: number
    yearMonthExperienceText: string
    fullName: string
    employeeType: string
    startDate: string
    companyPortionRateTxt: string
    employeePortionTxt: string
    companyPortionTxt: string
    totalTxt: string
    salaryTxt: string
}