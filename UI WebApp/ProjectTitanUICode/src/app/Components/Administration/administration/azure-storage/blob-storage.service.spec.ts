import { TestBed } from '@angular/core/testing';
import { BLOB_STORAGE_TOKEN } from './azureStorage';
import { blobStorageStub, uploadProgressStub } from './blob-storage-stub';
import { BlobStorageService } from './blob-storage.service';

describe('BlobStorageService', () => {
  let blobStorageService: BlobStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlobStorageService,
        {
          provide: BLOB_STORAGE_TOKEN,
          useValue: blobStorageStub
        }
      ]
    });
  });

  beforeEach(() => {
    blobStorageService = TestBed.get(BlobStorageService);
  });

  describe('Upload File', () => {
    it('should upload file and report progress', (done: DoneFn) => {
      const uploadProgress = blobStorageService.uploadToBlobStorage(
        {
          container: 'shipmentdocuments’',
          filename: 'myAssetFileName',
          // tslint:disable-next-line:max-line-length
          storageAccessToken: '?sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2018-11-21T13:06:57Z&st=2018-11-21T05:06:57Z&spr=https&sig=EjdVHl2mZ1hAFiSUcpi1aksIhJVfavDUrCVQQjIiuyU%3D',
          // tslint:disable-next-line:max-line-length
          storageUri: 'https://titanstorageaccnt.blob.core.windows.net/?sv=2017-11-09&ss=bfqt&srt=sco&sp=rwdlacup&se=2018-11-21T13:06:57Z&st=2018-11-21T05:06:57Z&spr=https&sig=EjdVHl2mZ1hAFiSUcpi1aksIhJVfavDUrCVQQjIiuyU%3D'
        },
        <File>{
          name: 'myAssetFileName',
          size: 1024 * 1024 * 33
        }
      );

      uploadProgress.subscribe(progress => {
        expect(progress).toBe(uploadProgressStub);
        if (progress === 100) {
          done();
        }
      });
    });

    it('should catch error', (done: DoneFn) => {
      const uploadProgress = blobStorageService.uploadToBlobStorage(
        {
          container: 'throwError',
          filename: '',
          storageAccessToken: '',
          storageUri: ''
        },
        <File>{
          name: 'myAssetFileName'
        }
      );

      uploadProgress.subscribe(
        progress => {},
        error => {
          expect(error).toBe('throwError');
          done();
        }
      );
    });
  });
});
