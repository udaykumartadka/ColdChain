using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

namespace CCTitanFunction
{
    public static class GetIncidentDetails
    {
        [FunctionName("GetIncidentDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // parse query parameter
            string shipmentID = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ShipmentID", true) == 0)
                .Value;      

            if (string.IsNullOrEmpty(shipmentID))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");

            List<Incident> incidentList = new List<Incident>();

             string sqlSelect = "SELECT DISTINCT  a.Id as IncidentId, b.[BeaconId],b.[ObjectId],b.[ObjectType],b.[CONTENT],a.Temperature,a.Humidity," +
                        " CASE WHEN[TemperatureAlert] = 1 and[ShockAlert] != 1 and[TamperAlert] != 1 and[HumidityAlert] != 1 THEN 'Temperature'" +
                         " WHEN[HumidityAlert] = 1 and[ShockAlert] != 1 and[TamperAlert] != 1 and[TemperatureAlert] != 1 THEN 'Humidity'" +
                         " WHEN[TamperAlert] = 1 and[ShockAlert] != 1 and[HumidityAlert] != 1 and[TemperatureAlert] != 1 THEN 'Tamper'" +
                         " WHEN[ShockAlert] = 1 and[TamperAlert] != 1 and[HumidityAlert] != 1 and[TemperatureAlert] != 1 THEN 'ShockAndVibration'" +
                         " ELSE 'Multiple'END as AlertType," +
                         " b.[TemperatureLowerLimit],b.[TemperatureUpperLimit],b.[HumidityLowerLimit],b.[HumidityUpperLimit]," +
                         " a.[Ack_Notes],a.[User],a.[Status],a.[ShockAlert],a.[TamperAlert],a.[AlertStartTime],a.[AlertEndTime],a.[LocationLattitude],a.[LocationLongitude],a.[AlertLocation]" +
                         " FROM[dbo].[Beacon_Object_Info] b" +
                          " INNER JOIN[Alert_Process] a ON b.[BeaconId] = a.[BeaconId] WHERE a.[ShipMasterId]=b.[ShipMasterId] and a.[ShipmentID]=@ShipmentID";

            using (SqlConnection conn = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(sqlSelect, conn))
                {
                    cmd.Parameters.Add("@ShipmentID", SqlDbType.NVarChar).Value = shipmentID;                    
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Incident objIncident = new Incident();
                        objIncident.IncidentId = (int)reader["IncidentId"];
                        objIncident.BeaconID = reader["BeaconId"].ToString();
                        objIncident.ObjectId = reader["ObjectId"].ToString();
                        objIncident.ObjectType = reader["ObjectType"].ToString();
                        objIncident.Content = reader["CONTENT"].ToString();
                        objIncident.Temperature = (double)reader["Temperature"];
                        objIncident.Humidity = (double)reader["Humidity"];
                        objIncident.AlertType = reader["AlertType"].ToString();
                        objIncident.MinTempLimit = (double)reader["TemperatureLowerLimit"];
                        objIncident.MaxTempLimit = (double)reader["TemperatureUpperLimit"];
                        objIncident.MinHumLimit = (double)reader["HumidityLowerLimit"];
                        objIncident.MaxHumLimit = (double)reader["HumidityUpperLimit"];
                        objIncident.AcknowledgeNotes = reader["Ack_Notes"].ToString();
                        objIncident.User = reader["User"].ToString();
                        objIncident.Status = reader["Status"].ToString();
                        objIncident.TamperAlert = (bool)reader["TamperAlert"];
                        objIncident.ShockVibrationAlert = (bool)reader["ShockAlert"];
                        objIncident.LocationLattitude = (double)reader["LocationLattitude"];
                        objIncident.LocationLongitude = (double)reader["LocationLongitude"];
                        objIncident.AlertStarttime = (DateTime)reader["AlertStartTime"];
                        objIncident.AlertEndtime = reader["AlertEndtime"].ToString();
                        objIncident.AlertLocation = reader["AlertLocation"].ToString();
                        
                        incidentList.Add(objIncident);

                    }
                    reader.Close();
                    conn.Close();
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(incidentList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class Incident
    {
        public int IncidentId { get; set; }
        public string BeaconID { get; set; }
        public string ObjectId { get; set; }
        public string ObjectType { get; set; }
        public string Content { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public string AlertType { get; set; }
        public bool TamperAlert { get; set; }
        public bool ShockVibrationAlert { get; set; }
        public double MaxTempLimit { get; set; }
        public double MinTempLimit { get; set; }
        public double MaxHumLimit { get; set; }
        public double MinHumLimit { get; set; }
        public string AcknowledgeNotes { get; set; }
        public string User { get; set; }
        public string Status { get; set; }
        public DateTime AlertStarttime { get; set; }
        public string AlertEndtime { get; set; }
        public double LocationLattitude { get; set; }
        public double LocationLongitude { get; set; }
        public string AlertLocation { get; set; }
    }
}
