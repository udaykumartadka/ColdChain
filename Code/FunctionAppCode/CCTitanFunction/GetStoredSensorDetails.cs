using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;

namespace CCTitanFunction
{
    public static class GetStoredSensorDetails
    {       

        [FunctionName("GetStoredSensorDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            string shipmasterId = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "ShipmasterId", true) == 0)
               .Value;
           

            if (string.IsNullOrEmpty(shipmasterId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }


            var Cosmosconnectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var ConnectionstrinG = Environment.GetEnvironmentVariable("SQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            DocumentClient client = new DocumentClient(new Uri(Cosmosconnectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };

            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");
            var collectionAlert = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanAlertCollection");

            List<StoredSensorDetails> sensorList = new List<StoredSensorDetails>();

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");

            string SqlSelect = "SELECT DISTINCT [ObjectType],[ObjectId],[BeaconId],'Stored Data'As [BeaconStatus] FROM [Beacon_Object_Info] WHERE [ShipMasterId]=@ShipMasterId";

            string cosmosTelemeterySelect = "";

            using (SqlConnection conn = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(SqlSelect, conn))
                {

                    cmd.Parameters.Add("@ShipMasterId", SqlDbType.Int).Value = shipmasterId;
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        StoredSensorDetails Sensor = new StoredSensorDetails();
                        Sensor.ObjectType = (string)reader["ObjectType"];
                        Sensor.ObjectId = (string)reader["ObjectId"];
                        Sensor.BeaconId = (string)reader["BeaconId"];
                        Sensor.BeaconStatus = (string)reader["BeaconStatus"];
                        StoredTelemetryDetails objTelmetry = new StoredTelemetryDetails();
                        cosmosTelemeterySelect = "SELECT TOP 1 c.temperature,c.humidity,f.current_system_time,c.humidity_alert,c.temperature_alert,c.tamper_alert,c.shock_alert " +
                                " FROM f JOIN c IN f.sensor_Values WHERE c.sensorID = '" + Sensor.BeaconId + "' and (f.message_type='Stored_Telemetry' or f.message_type='Stored_Alert')  order by f.current_system_time desc";
                        IQueryable<StoredTelemetryDetails> cosTelemetry = client.CreateDocumentQuery<StoredTelemetryDetails>(collectionlinK, cosmosTelemeterySelect);
                        objTelmetry = cosTelemetry.ToList().SingleOrDefault();


                        if (objTelmetry != null)
                        {
                            Sensor.Temperature = objTelmetry.Temperature;
                            Sensor.Humidity = objTelmetry.Humidity;
                            Sensor.BeaconTimestamp = objTelmetry.current_system_time;
                            Sensor.HumidityAlert = objTelmetry.humidity_alert;
                            Sensor.TamperAlert = objTelmetry.tamper_alert;
                            Sensor.TemperatureAlert = objTelmetry.temperature_alert;
                            Sensor.ShockVibrationAlert = objTelmetry.shock_alert;
                        }
                        sensorList.Add(Sensor);
                    }

                    reader.Close();
                    conn.Close();
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(sensorList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class StoredSensorDetails
    {
        public string ObjectType { get; set; }
        public string ObjectId { get; set; }
        public string BeaconId { get; set; }
        public string BeaconStatus { get; set; }
        public DateTime BeaconTimestamp { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public bool TemperatureAlert { get; set; }
        public bool HumidityAlert { get; set; }
        public bool TamperAlert { get; set; }
        public bool ShockVibrationAlert { get; set; }

    }

    public class StoredTelemetryDetails
    {
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public bool temperature_alert { get; set; }
        public bool humidity_alert { get; set; }
        public bool tamper_alert { get; set; }
        public bool shock_alert { get; set; }
        public DateTime current_system_time { get; set; }

    }
}
