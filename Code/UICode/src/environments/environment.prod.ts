export const environment = {
  production: true,
  API_Endpoint: 'https://pj-titan-fn.azurewebsites.net/api',

  // Blob Storage Related Configurations
  // tslint:disable-next-line:max-line-length
  SAS_Token: '?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2019-05-31T16:40:11Z&st=2019-01-03T08:40:11Z&spr=https&sig=cVlT1a4aQC02uBIvpvivYKK7r8ue7LrvIuztoSM0%2FDk%3D',
  blobAccessUrl: 'https://titanstorageaccnt.blob.core.windows.net/shipmentdocuments/',
  storageLink: 'https://titanstorageaccnt.blob.core.windows.net/',

  // AD related Configuration
  client_id: 'b68e176a-4158-4bc5-9b83-fcd0a80f6e82',
  tenant: '1a6dbb80-5290-4fd1-a938-0ad7795dfd7a',

  // Blockchain Related Configuration
  Web3_password: 'Wipro@123456',
  contractAddress: '0x3110bc96848f05062d2c8e563da89cc26433195c',
  HttpProvider: 'http://40.117.159.33:8545',
  gasLimit: 3000000,

   // Bing Maps API Related
   BingApiKey : 'Ait5cIqk1VP54uASgs8lBo5xyx3mND_ksYExmw547lKKq2RI4rCCUaHA0Ch7uBnm'
};
