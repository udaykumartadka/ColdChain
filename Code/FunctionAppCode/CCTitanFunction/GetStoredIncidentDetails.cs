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
    public static class GetStoredIncidentDetails
    {
        [FunctionName("GetStoredIncidentDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {

            var Cosmosconnectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var ConnectionstrinG = Environment.GetEnvironmentVariable("SQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            string shipmentID = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "ShipmentID", true) == 0)
               .Value;

            if (string.IsNullOrEmpty(shipmentID))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }

            DocumentClient client = new DocumentClient(new Uri(Cosmosconnectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };

            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");
         

            List<StoredIncident> sensorList = new List<StoredIncident>();
            List<StoredIncident> sensorListStart = new List<StoredIncident>();
            List<StoredIncident> sensorListEnd = new List<StoredIncident>();
            List<StoredIncident> sensorListMerge = new List<StoredIncident>();

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");

            string sqlSelect = "SELECT DISTINCT b.[BeaconId],b.[ObjectId],b.[ObjectType],b.[CONTENT] FROM[dbo].[Beacon_Object_Info] b" +
                " INNER JOIN[Shipping_Master] s ON b.[ShipMasterId]= s.[ShipMasterId] WHERE s.[ShipmentID]=@ShipmentID";

            string cosmosTelemeterySelect = "";

            using (SqlConnection conn = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(sqlSelect, conn))
                {

                    cmd.Parameters.Add("@ShipmentID", SqlDbType.VarChar).Value = shipmentID;
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        StoredIncident Sensor = new StoredIncident();
                        Sensor.ObjectType = (string)reader["ObjectType"];
                        Sensor.ObjectId = (string)reader["ObjectId"];
                        Sensor.BeaconID = (string)reader["BeaconId"];
                        Sensor.Content = (string)reader["CONTENT"];
                        //StoredIncidentTelemetry objTelmetry = new StoredIncidentTelemetry();
                        cosmosTelemeterySelect = "SELECT distinct c.temperature,c.humidity,f.current_system_time,c.humidity_alert,c.temperature_alert,c.tamper_alert,c.shock_alert " +
                                " FROM f JOIN c IN f.sensor_Values WHERE c.sensorID = '" + Sensor.BeaconID + "' and  f.message_type='Stored_Alert' order by f.current_system_time desc "; //order by f.current_system_time desc
                        IQueryable<StoredIncidentTelemetry> cosTelemetry = client.CreateDocumentQuery<StoredIncidentTelemetry>(collectionlinK, cosmosTelemeterySelect);
                        //objTelmetry = cosTelemetry.ToList().SingleOrDefault();
                        int i = 0;
                        foreach (StoredIncidentTelemetry objTelmetry in cosTelemetry)
                        {
                            if (objTelmetry != null)
                            {
                                StoredIncident objIncident = new StoredIncident();
                                objIncident.ObjectType = (string)reader["ObjectType"];
                                objIncident.ObjectId = (string)reader["ObjectId"];
                                objIncident.BeaconID = (string)reader["BeaconId"];
                                objIncident.Content = (string)reader["CONTENT"];
                                objIncident.AlertStarttime = objTelmetry.current_system_time;
                                objIncident.AlertType = GetAlertType(objTelmetry);
                                i = i + 1;
                                //objIncident.Content = (i).ToString();
                                sensorList.Add(objIncident);
                            }
                        }
                       
                    }

                    reader.Close();
                    conn.Close();
                }
            }
            //sensorList= sensorList.OrderBy(o => o.AlertStarttime).ThenBy(o => o.BeaconID).ToList();
            sensorList = sensorList.OrderBy(o => o.BeaconID).ThenBy(o => o.AlertType).ThenBy(o => o.AlertStarttime).ToList();

            sensorListStart= sensorList.Where((t, i) => i % 2 == 0).ToArray().ToList();
            sensorListEnd = sensorList.Where((t, i) => i % 2 == 1).ToArray().ToList();
            int cnt = 0;
            foreach (StoredIncident item in sensorListStart)
            {
               
                    StoredIncident objMerge = new StoredIncident();
                    objMerge.ObjectType = item.ObjectType;
                    objMerge.ObjectId = item.ObjectId;
                    objMerge.BeaconID = item.BeaconID;
                    objMerge.Content = item.Content;
                    objMerge.AlertStarttime = item.AlertStarttime;
                    objMerge.AlertType = item.AlertType;
                    objMerge.AlertStarttime = item.AlertStarttime;
                    StoredIncident objTemp = new StoredIncident();
                    if (sensorListEnd.Count > cnt)
                    {
                        objTemp = sensorListEnd.ElementAt(cnt);
                        if (objMerge.BeaconID == objTemp.BeaconID && objMerge.AlertType == objTemp.AlertType)
                        {
                            objMerge.AlertEndtime = objTemp.AlertStarttime;
                            TimeSpan diffTime = objMerge.AlertEndtime - objMerge.AlertStarttime;
                            objMerge.Duration = diffTime.Seconds;
                        }
                    }
                    if (objMerge.Duration>0)
                    { 
                        sensorListMerge.Add(objMerge);
                    }
                cnt = cnt + 1;

            }

            //sensorListEnd.ElementAt(0)
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(sensorListMerge, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }

        private static string GetAlertType(StoredIncidentTelemetry objTelmetry)
        {
            string alertType = "Multiple";

            if (objTelmetry.temperature_alert == true && objTelmetry.tamper_alert == false && objTelmetry.shock_alert == false && objTelmetry.humidity_alert == false)
            {
                alertType = "Temperature";
            }
            else if (objTelmetry.temperature_alert == false && objTelmetry.tamper_alert == false && objTelmetry.shock_alert == false && objTelmetry.humidity_alert == true)
            {
                alertType = "Humidity"; 
            }
            else if (objTelmetry.temperature_alert == false && objTelmetry.tamper_alert == true && objTelmetry.shock_alert == false && objTelmetry.humidity_alert == false)
            {
                alertType = "Tamper";
            }
            else if (objTelmetry.temperature_alert == false && objTelmetry.tamper_alert == false && objTelmetry.shock_alert == true && objTelmetry.humidity_alert == false)
            {
                alertType = "ShockAndVibration";
            }           

            return alertType;
        }
    }

    public class StoredIncident
    {       
        public string BeaconID { get; set; }
        public string ObjectId { get; set; }
        public string ObjectType { get; set; }
        public string Content { get; set; }     
        public string AlertType { get; set; }       
        public DateTime AlertStarttime { get; set; }
        public DateTime AlertEndtime { get; set; }
        public  int Duration { get; set; }
    }

    public class StoredIncidentTelemetry
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
