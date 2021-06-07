import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../http.service';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  excelData:any={};
  notjoinCol:any=[];
  regData:any=[];
  questionAns:any=[];
  displayedColumns!: string[];
  displayedColumns1!: string[];
  displayedColumns2!: string[];
  datasource:any;
  datasource1:any;
  datasource2:any;
  showData:boolean=false;
  fileName= 'ExcelSheet.xlsx'; 
  constructor(private httpservice:HttpService) { }

  ngOnInit(): void {
    this.httpservice.fetchData().subscribe((data:any)=>{
      console.log(data);
      this.excelData=data;
      this.init()
      this.init1()
      this.init2()
    })
  }

  init(){
    this.notjoinCol=[];
    this.displayedColumns = ['reason','other_reason'];
    new Promise((resolve)=>{
    this.excelData['not_joining_response'].forEach((el:any) => {
      this.notjoinCol.push(el['nj_response']);
    });
    resolve(this.notjoinCol)
    }).then(data=>{
      this.datasource=new MatTableDataSource(<[]>data);

    })
  }

  init1(){
    this.regData=[];
    
    this.displayedColumns1=['trial_id','date_of_birth','gender','class','division','stream','guardian_name'];
    new Promise((resolve)=>{
      this.excelData['registration_details'].forEach((el:any)=> {
        let dataConv=new Date(el['date_of_birth']);
        let dob=dataConv.getDate()+"-"+(dataConv.getMonth()+1)+"-"+dataConv.getFullYear();
        let data={
          'trial_id':el['trial_id'],
          'date_of_birth':dob,
          'gender':el['gender'],
          'class':el['class'],
          'division':el['division'],
          'stream':el['stream'],
          'guardian_name':el['guardian_name']
        }
        this.regData.push(data);
      });
      resolve(this.regData)
    }).then(data=>{
      this.datasource1=new MatTableDataSource(<[]>data);
    })
  }

  init2(){
    this.questionAns=[];
    this.displayedColumns2=['participant_id','date','full_name','I am currently enrolled in class 9-12th','I am between 12-20 years old','I can understand and read English or Hindi','phone_number'];
    new Promise((resolve)=>{
      this.excelData['eligibilty_answers'].forEach((el:any,i:number)=> {
        if(el['created_on']>=1622160000000){
          let data:any={};
          let dataConv=new Date(el['created_on']);
          let dob=dataConv.getDate()+"-"+(dataConv.getMonth()+1)+"-"+dataConv.getFullYear();
          data['participant_id']=el['er_id'];
          data['date']=dob
          data['full_name']=el['er_response'][0].answer,
          data['I am between 12-20 years old']=(el['er_response'][2].answer===0)?'No':'Yes'
          data['I can understand and read English or Hindi']=(el['er_response'][3].answer===0)?'No':'Yes'
          data['phone_number']=(el['er_response'][4].answer)+"";
          data['I am currently enrolled in class 9-12th']=(el['er_response'][1].answer===0)?'No':'Yes'
          this.questionAns.push({...data});
          data={};
        }
      });
      resolve(this.questionAns);
    }).then(data=>{
  //    console.log(data)
      this.datasource2=new MatTableDataSource(<[]>data)
    })
  }

  exportexcel(){
    let element = document.getElementById('not-joining-reason'); 
    let element1= document.getElementById('reg-details'); 
    let element2= document.getElementById('eligibility-questions');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      const ws1: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element1);
      const ws2: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element2);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Not Interested participants');
      XLSX.utils.book_append_sheet(wb, ws2, 'Eligibility')
      XLSX.utils.book_append_sheet(wb, ws1, 'Demographic Details')
      XLSX.writeFile(wb, this.fileName);
  }

}
