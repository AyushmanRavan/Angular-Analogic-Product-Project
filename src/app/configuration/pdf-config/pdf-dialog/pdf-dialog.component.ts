import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent {
  pdf: FormGroup;
  loading: boolean;
  file: File;
  selectedFile: File = null;
  myReader: FileReader = new FileReader();

  // For image.......
  image;
  changeListener($event): void {
    this.selectedFile = <File>$event.target.files[0];
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.file = inputValue.files[0];
    this.myReader.onloadend = (e) => {
      this.image = this.myReader.result;
    }
    this.myReader.readAsDataURL(this.file);
  }


  constructor(
    private _dialogRef: MatDialogRef<PdfDialogComponent>,
    private _fb: FormBuilder,
    private _pdf: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {

    this.pdf = this._fb.group({
      id: '',
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      logo: ['']
    });
    if (dialog.mode === MODE.UPDATE) {

      this.pdf.setValue(dialog.details)
      this.image = dialog.details.logo;
    };
  }



  onSubmit() {
    if (this.pdf.valid) {
      this.update(this.pdf.value, this.dialog.mode);
    }
  }

  update(pdf, mode) {

    this.pdf.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        delete pdf.logo;
        this._pdf
          .addPdf(pdf, this.selectedFile)
          .subscribe(
            newAlarm => this._dialogRef.close(newAlarm),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:

        delete pdf.logo;
        this._pdf
          .updatePdf(pdf, this.selectedFile)
          .subscribe(
            res => this._dialogRef.close(pdf),
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._pdf
          .deletePdf(pdf.id)
          .subscribe(
            res => this._dialogRef.close(pdf),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._pdf.throwError(err);
    this.pdf.enable();
    this.loading = false;
  }
}



