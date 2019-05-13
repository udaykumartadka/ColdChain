import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { ISasToken } from '../azure-storage/azureStorage';
import { BlobStorageService } from '../azure-storage/blob-storage.service';
import { DocType} from './../../../../Interfaces/docTypeOption';
import { ContractService } from '../../../../Services/Blockchain Contract Services/contract.service';
import { environment } from '../../../../../environments/environment';

// Imporing Config File

import { AppSetting } from '../../../../Configuration Files/AppSetting';

interface IUploadProgress {
  filename: string;
  progress: number;
}

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {

  shipmentID: string;

  fileInfo: any;
  uploadProgress$: Observable<IUploadProgress[]>;
  filesSelected = false;
  fileName: String;
  // blobAccessUrl = 'https://titanstorageaccnt.blob.core.windows.net/shipmentdocuments/';
  blobAccessUrl = environment.blobAccessUrl;

  // Doc Type Options
  docOptions: DocType[];
  docSelected: Number;
  docType: string;
  docRef: string;
  encryptedDocRef: string;
  decryptedDocRef: string;
  temp: any;
  fileUploadProgress: number;
  showLoader: boolean;
  showUploadComplete: boolean;

  ngOnInit() {

    this.docOptions = [

      {id: 0 , docType: ' Choose Document Type'},
      {id: 1 , docType: ' Invoice'},
      {id: 2 , docType: ' Purchase Order '},
      {id: 3 , docType: ' Proforma Invoice'},
      {id: 4 , docType: ' Insurance Cover'},
      {id: 5 , docType: ' Goods List'},
      {id: 6 , docType: ' Airway Bill Document'},
      {id: 7 , docType: ' Receipt '},

    ];

    // Default Doc type Option
    this.docSelected = 0;
  }

  constructor(
    private blobStorage: BlobStorageService,
    private cs: ContractService) {
    this.fileName = '';
    this.docType = '';
    this.showLoader = false;
    this.showUploadComplete = false;
    this.shipmentID = this.cs.BC_ShipmentID;
  }

  onFileChange(event: any): void {
    this.showLoader = true;
    this.showUploadComplete = false;
    this.filesSelected = true;

    this.uploadProgress$ = from(event.target.files as FileList).pipe(
      map(file => this.uploadFile(file)), // Getting FIle Details HEre
      combineAll()
    );


  }

  uploadFile(file: File): Observable<IUploadProgress> {
    this.fileName = file.name;

    const accessToken: ISasToken = {
      container: 'shipmentdocuments',
      filename: file.name,
      storageAccessToken: environment.SAS_Token,
      // tslint:disable-next-line:max-line-length
      // storageUri: 'https://titanstorageaccnt.blob.core.windows.net/' + AppSetting.SAS_Token,
      storageUri: environment.storageLink + environment.SAS_Token,
     // Add SAS Token After .net/ --> If the token Expires in Future
    };

    // console.log(accessToken.storageUri);
    return this.blobStorage
      .uploadToBlobStorage(accessToken, file)
      .pipe(map(progress => this.mapProgress(file, progress)));
  }

  // Upload To Blockchain
  uploadDocRef(docTypeID) {
    for (let i = 0; i < this.docOptions.length; i++) {
      // tslint:disable-next-line:triple-equals
      if ( this.docOptions[i].id == docTypeID) {
        this.docType = this.docOptions[i].docType;
      }
    }

    this.docRef = this.blobAccessUrl + this.fileName;
    this.encryptedDocRef = btoa(this.docRef);
    this.cs.updateShipmentDocs(this.shipmentID, this.fileName, this.docType, this.encryptedDocRef, 'Document Upload', 'BlockMaker');

    this.docSelected = 0;
  }

  private mapProgress(file: File, progress: number): IUploadProgress {
 console.log(progress);

    if (progress === 100) {
      this.showLoader = false;
      this.showUploadComplete = true;
      this.filesSelected = false;
    }
    console.log(progress);
    return {
      filename: file.name,
      progress: progress
    };
  }
}
