var nodeoutlook = require('nodejs-nodemailer-outlook')



var sendEmail = function(data,cb){
var str = 'Hi, This is an incident information mail from Titan Secure - Your Secure Cold Chain Solution\nIncident Info\nShipment ID: "'+data.Shipment_ID+'"\nAlert Type: "'+data.Alert_Type+'"\nAlert Value: "'+data.Alert_Value+'"\nAlert Status: "'+data.Alert_Status+'"\nAlert Start time: "'+data.Alert_Start_Time+'"\nAlert End time: "'+data.Alert_End_Time+'"\nOn the Object Type: "'+data.Object_Type+'", Object ID: "'+data.Object_ID+'" belonging to the Pallet: "'+data.Pallet_ID+'" Please click here for more details- https://www.azureiotsolutions.com'
nodeoutlook.sendEmail({
      auth: {
          user: "cctitan@outlook.com",
          pass: "coldchain@123"
      }, from: 'cctitan@outlook.com',
      to: 'cctitan@outlook.com',
      subject: 'Alert Notification on Shipment: "'+data.Shipment_ID+'"',
      text: str,
  }, function () {
    console.log("SENT MAIL: ")
  });
cb(null,null);
}


module.exports = {
  'sendEmail' : sendEmail
}
