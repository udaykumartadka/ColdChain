using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace CCTitanFunction
{
    public static class AddShipmentDetails
    {
        [FunctionName("AddShipmentDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");


            List<Product> productList = new List<Product>();

            // Get request body

            dynamic body = await req.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            var shipMaster = JsonConvert.DeserializeObject<ShipMaster>(body as string);

            string shipmentID = shipMaster?.ShipmentID;
            string shipmentStatus = shipMaster?.ShipmentStatus;
            string createdBy = shipMaster?.CreatedBy;
            string sourceLoc = shipMaster?.SourceLoc;
            string destinationLoc = shipMaster?.DestinationLoc;
            string logisticPartner = shipMaster?.LogisticPartner;
            var dateofShipment = shipMaster?.DateofShipment;
            var deliveryDate = shipMaster?.DeliveryDate;
            string invoiceDocRef = shipMaster?.InvoiceDocRef;
            string pONumber = shipMaster?.PONumber;
            string blockchainStatus = shipMaster?.BlockchainStatus;
            string transactionHash = shipMaster?.TransactionHash;

            productList = shipMaster?.ProductList;


            if (string.IsNullOrEmpty(shipmentID) || string.IsNullOrEmpty(blockchainStatus))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            log.Info("Connecting to DataBase");

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;

            string SqlInsert = "INSERT INTO Shipping_Master([ShipmentID],[ShipmentStatus],[CreatedBy],[CreatedTime],[SourceLoc],[DestinationLoc],[LogisticPartner]," +
                             "[DateofShipment],[DeliveryDate],[InvoiceDocRef],[PONumber],[BlockchainStatus],[TransactionHash],[IsActive],[GatewayCount],[PalletCount],[CartonCount],[BoxCount],[ProductCount]," +
                             "[BeaconCount],TemperatureBreach,HumidityBreach,TamperBreach,VibrationBreach,CurrrentLat,CurrrentLong,UnreachableDevice)" +
                             " VALUES(@ShipmentID, @ShipmentStatus, @CreatedBy, @CreatedDateTime, @SourceLoc, @DestinationLoc, @LogisticPartner," +
                            " @DateofShipment, @DeliveryDate, @InvoiceDocRef, @PONumber, @BlockchainStatus, @TransactionHash, @IsActive,@GatewayCount," +
                            "@PalletCount,@CartonCount,@BoxCount,@ProductCount,@BeaconCount,@TemperatureBreach,@HumidityBreach,@TamperBreach,@VibrationBreach," +
                            "@CurrrentLat,@CurrrentLong,@UnreachableDevice)";


            try
            {
                command = new SqlCommand(SqlInsert, conn);

                command.Parameters.Add("@ShipmentID", SqlDbType.NVarChar).Value = shipmentID;
                command.Parameters.Add("@ShipmentStatus", SqlDbType.NVarChar).Value = shipmentStatus;
                command.Parameters.Add("@CreatedBy", SqlDbType.NVarChar).Value = createdBy;
                command.Parameters.Add("@CreatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                command.Parameters.Add("@SourceLoc", SqlDbType.NVarChar).Value = sourceLoc;
                command.Parameters.Add("@DestinationLoc", SqlDbType.NVarChar).Value = destinationLoc;
                command.Parameters.Add("@LogisticPartner", SqlDbType.NVarChar).Value = logisticPartner;
                command.Parameters.Add("@DateofShipment", SqlDbType.DateTime).Value = dateofShipment;
                command.Parameters.Add("@DeliveryDate", SqlDbType.DateTime).Value = deliveryDate;
                command.Parameters.Add("@InvoiceDocRef", SqlDbType.NVarChar).Value = invoiceDocRef;
                command.Parameters.Add("@PONumber", SqlDbType.NVarChar).Value = pONumber;
                command.Parameters.Add("@BlockchainStatus", SqlDbType.NVarChar).Value = blockchainStatus;
                command.Parameters.Add("@TransactionHash", SqlDbType.NVarChar).Value = transactionHash;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = 1;

                command.Parameters.Add("@GatewayCount", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@PalletCount", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@CartonCount", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@BoxCount", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@ProductCount", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@BeaconCount", SqlDbType.Int).Value = 0;

                command.Parameters.Add("@TemperatureBreach", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@HumidityBreach", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@TamperBreach", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@VibrationBreach", SqlDbType.Int).Value = 0;
                command.Parameters.Add("@CurrrentLat", SqlDbType.Float).Value = 0.0;
                command.Parameters.Add("@CurrrentLong", SqlDbType.Float).Value = 0.0;
                command.Parameters.Add("@UnreachableDevice", SqlDbType.Int).Value = 0;

                conn.Open();
                command.ExecuteNonQuery();

                string qrySelectShipId = "SELECT ShipmasterID FROM Shipping_Master WHERE ShipmentID= @ShipmentID";
                command.Parameters.Clear();
                command = new SqlCommand(qrySelectShipId, conn);
                command.Parameters.Add("@ShipmentID", SqlDbType.NVarChar).Value = shipmentID;

                var shipMasterId = command.ExecuteScalar();

                if (productList.Count() > 0)
                {
                    SqlInsert = "INSERT INTO Shipment_Product([ShipMasterID] , [ProductID], [Product], [Quantity]) Values(@ShipMasterID, @ProductID, @Product, @Quantity)";

                    foreach (Product item in productList)
                    {
                        command.Parameters.Clear();
                        command = new SqlCommand(SqlInsert, conn);
                        command.Parameters.Add("@ShipMasterID", SqlDbType.Int).Value = (int)shipMasterId;
                        command.Parameters.Add("@ProductID", SqlDbType.NVarChar).Value = item.ProductId;
                        command.Parameters.Add("@Product", SqlDbType.NVarChar).Value = item.ProductName;
                        command.Parameters.Add("@Quantity", SqlDbType.Int).Value = item.Quantity;
                        command.ExecuteNonQuery();
                    }

                }

                conn.Close();
                return req.CreateResponse(HttpStatusCode.OK, "Created shipment details.");
            }
            catch (Exception ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot add the record because of an Exception");
            }

        }
    }

    public class Product
    {
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }

    }
    public class ShipMaster
    {
        public string ShipmentID { get; set; }
        public string ShipmentStatus { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string SourceLoc { get; set; }
        public string DestinationLoc { get; set; }
        public string LogisticPartner { get; set; }
        public DateTime DateofShipment { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string InvoiceDocRef { get; set; }
        public string PONumber { get; set; }
        public string BlockchainStatus { get; set; }
        public string TransactionHash { get; set; }
        public bool IsActive { get; set; }
        public List<Product> ProductList { get; set; }
    }
}
