using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace CCTitanFunction
{
    public static class GetShipmentReport
    {
        [FunctionName("GetShipmentReport")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // parse query parameter
            string shipmentID = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ShipmentID", true) == 0)
                .Value;
            log.Info("Inside beacon data");

            if (string.IsNullOrEmpty(shipmentID))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }

            log.Info("Connecting to DataBase");

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");

            var NOsqlconnectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var SQLconnectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            DocumentClient client = new DocumentClient(new Uri(NOsqlconnectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };
            //string param = "eadd3a4f3531";
            //string cosmosQuery = "SELECT TOP 1 c.temperature,c.humidity,f.current_system_time,c.humidity_alert,c.temperature_alert,c.tamper_alert FROM f JOIN c IN f.sensor_Values  WHERE c.sensorID = '"+ param + "' order by f.current_system_time desc";

            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");


            Shipment shipMent = new Shipment();

            string SqlSelect = "SELECT[ShipmasterID],[ShipmentID],[ShipmentStatus],[CreatedBy],[CreatedTime],[SourceLoc],[DestinationLoc],[LogisticPartner],[DateofShipment],[DeliveryDate],"
                + "[InvoiceDocRef],[PONumber],[BlockchainStatus],[GatewayCount],[PalletCount],[CartonCount],[BoxCount],[ProductCount],[BeaconCount],"
                + "[CurrrentLat],[CurrrentLong],[TemperatureBreach],[HumidityBreach],[TamperBreach],[VibrationBreach],[UnreachableDevice],[IsActive]  "
                + " FROM [Shipping_Master] WHERE [ShipmentID] =@ShipmentID";

            using (SqlConnection conn = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(SqlSelect, conn))
                {
                    cmd.Parameters.Add("@ShipmentID", SqlDbType.Char);
                    cmd.Parameters["@ShipmentID"].Value = shipmentID;
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {

                        shipMent.ShipmasterID = (int)reader["ShipmasterID"];
                        shipMent.ShipmentID = reader["ShipmentID"].ToString();
                        shipMent.ShipmentStatus = reader["ShipmentStatus"].ToString();
                        shipMent.CreatedBy = reader["CreatedBy"].ToString();
                        shipMent.CreatedDateTime = (DateTime)reader["CreatedTime"];
                        shipMent.SourceLoc = reader["SourceLoc"].ToString();
                        shipMent.DestinationLoc = reader["DestinationLoc"].ToString();
                        shipMent.LogisticPartner = reader["LogisticPartner"].ToString();
                        shipMent.DateofShipment = (DateTime)reader["DateofShipment"];
                        shipMent.DeliveryDate = (DateTime)reader["DeliveryDate"];
                        shipMent.InvoiceDocRef = reader["InvoiceDocRef"].ToString();
                        shipMent.PONumber = reader["PONumber"].ToString();
                        shipMent.IsActive = (bool)reader["IsActive"];
                        shipMent.GatewayCount = (int)reader["GatewayCount"];
                        shipMent.PalletCount = (int)reader["PalletCount"];
                        shipMent.CartonCount = (int)reader["CartonCount"];
                        shipMent.BoxCount = (int)reader["BoxCount"];
                        shipMent.ProductCount = (int)reader["ProductCount"];
                        shipMent.BeaconCount = (int)reader["BeaconCount"];
                        shipMent.BlockchainStatus = reader["BlockchainStatus"].ToString();
                        shipMent.TemperatureBreachCount = (int)reader["TemperatureBreach"];
                        shipMent.HumidityBreachCount = (int)reader["HumidityBreach"];
                        shipMent.ShockVibrationCount = (int)reader["VibrationBreach"];
                        shipMent.TamperBreachCount = (int)reader["TamperBreach"];
                        shipMent.UnreachableDeviceCount = (int)reader["UnreachableDevice"];
                  

                        string gatewayID = GetMacId(shipMent.ShipmasterID);
                        Location objLocation = new Location();

                        string cosmosTelemeterySelect = "SELECT TOP 1  c.gatewayId, c.current_longitude,c.current_latitude,c.current_system_time,c.current_gps_time, "
                            + "c.last_recorded_latitude,c.last_recorded_longitude ,c.last_recorded_gps_time FROM c where c.gatewayId = '" + gatewayID + "' order by c.current_system_time desc";
                        IQueryable<Location> cosTelemetry = client.CreateDocumentQuery<Location>(collectionlinK, cosmosTelemeterySelect);
                        objLocation = cosTelemetry.ToList().SingleOrDefault();

                        if (objLocation != null)
                        {
                            if (objLocation.current_latitude == 0) { shipMent.CurrentLatitude = objLocation.last_recorded_latitude; }
                            else { shipMent.CurrentLatitude = objLocation.current_latitude; }

                            if (objLocation.current_longitude == 0) { shipMent.CurrentLongitude = objLocation.last_recorded_longitude; }
                            else { shipMent.CurrentLongitude = objLocation.current_longitude; }


                            if (string.IsNullOrEmpty(objLocation.current_gps_time))
                            {
                                shipMent.CurrentGPSTime = objLocation.last_recorded_gps_time;
                            }
                            else
                            {
                                shipMent.CurrentGPSTime = objLocation.current_gps_time;
                            }

                        }

                        //GPS Data Test
                        Location objGPS = new Location();
                        int trackerId = GetTrackerId(gatewayID);
                        objGPS = GetGPSData(trackerId);
                        shipMent.CurrentLatitude = objGPS.current_latitude;
                        shipMent.CurrentLongitude = objGPS.current_longitude;
                        shipMent.CurrentGPSTime = objGPS.current_gps_time;
                        /////GPS/////////////////


                        break;
                    }
                    reader.Close();
                    conn.Close();
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(shipMent, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }

        private static string GetMacId(int shipmasterID)
        {
            string macId = "";
            string qrySelectMAcId = "   SELECT TOP 1 [MacId] from  [dbo].[VW_Gateway_Pallet_ShipmentAssociation] WHERE [ShipmasterID] = @ShipmasterID";
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection connMac = new SqlConnection(Connectionstring);
            SqlCommand commandMac = new SqlCommand(qrySelectMAcId, connMac);
            commandMac.Parameters.Clear();
            commandMac.Parameters.Add("@ShipmasterID", SqlDbType.Int).Value = shipmasterID;
            connMac.Open();
            var gatewayDeviceId = commandMac.ExecuteScalar();
            connMac.Close();
            if (gatewayDeviceId != null) { macId = (string)gatewayDeviceId; }

            return macId;
        }

        private static int GetTrackerId(string macId)
        {
            int trackerId = 0;
            string qrySelectTrackerId = "SELECT a.tracker_id  FROM[VW_Gateway_Pallet_ShipmentAssociation] a WHERE a.MacId = @MacID";
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection connMac = new SqlConnection(Connectionstring);
            SqlCommand commandMac = new SqlCommand(qrySelectTrackerId, connMac);
            commandMac.Parameters.Clear();
            commandMac.Parameters.Add("@MacID", SqlDbType.NVarChar).Value = macId;
            connMac.Open();
            var gatewayTrackerId = commandMac.ExecuteScalar();
            connMac.Close();
            if (gatewayTrackerId != null) { trackerId = (int)gatewayTrackerId; }

            return trackerId;
        }

        private static Location GetGPSData(int trackerId)
        {

            //string qrySelecGPS = "   SELECT TOP 1 id,[TrackerId],[Latitude],[Longitude],[Timestamp] FROM[dbo].[GPS_Data] ORDER BY[Timestamp] desc";
            string qrySelecGPS = "SELECT TOP 1 a.id,a.[TrackerId],a.[Latitude],a.[Longitude],a.[Timestamp] FROM[dbo].[GPS_Data] a INNER JOIN[DeviceInfo] d on a.[TrackerId] = d.macid " +
                           " WHERE d.deviceid = @TrackerId ORDER BY a.[Timestamp] desc";
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection connGPS = new SqlConnection(Connectionstring);
            SqlCommand commandGPS = new SqlCommand(qrySelecGPS, connGPS);
            commandGPS.Parameters.Clear();
            commandGPS.Parameters.Add("@TrackerId", SqlDbType.Int).Value = trackerId;
            connGPS.Open();
            SqlDataReader reader = commandGPS.ExecuteReader();
            Location objLocation = new Location();
            while (reader.Read())
            {
                objLocation.current_latitude = (double)reader["Latitude"];
                objLocation.current_longitude = (double)reader["Longitude"];
                objLocation.current_system_time = (DateTime)reader["Timestamp"];
                objLocation.current_gps_time = reader["Timestamp"].ToString();
                break;
            }
            reader.Close();
            connGPS.Close();

            return objLocation;
        }
    }

    public class Shipment
    {
        public int ShipmasterID { get; set; }
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
        public int GatewayCount { get; set; }
        public int PalletCount { get; set; }
        public int CartonCount { get; set; }
        public int BoxCount { get; set; }
        public int ProductCount { get; set; }
        public int BeaconCount { get; set; }
        public int TemperatureBreachCount { get; set; }
        public int HumidityBreachCount { get; set; }
        public int ShockVibrationCount { get; set; }
        public int TamperBreachCount { get; set; }
        public int UnreachableDeviceCount { get; set; }
        public double CurrentLatitude { get; set; }
        public double CurrentLongitude { get; set; }
        public string AlertStatus { get; set; }
        public string CurrentGPSTime { get; set; }

    }

    public class Location
    {
        public string gatewayId { get; set; }
        public float last_recorded_latitude { get; set; }
        public float last_recorded_longitude { get; set; }
        public double current_latitude { get; set; }
        public double current_longitude { get; set; }
        public DateTime current_system_time { get; set; }
        public string current_gps_time { get; set; }
        public string last_recorded_gps_time { get; set; }
    }
}
