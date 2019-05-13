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
using System.Text;

namespace CCTitanFunction
{
    public static class GetBeaconDetails
    {
        [FunctionName("GetBeaconDetails")]
        public static HttpResponseMessage Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // parse query parameter
            string ShipMasterId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ShipMasterId", true) == 0)
                .Value;

            if (string.IsNullOrEmpty(ShipMasterId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }
            log.Info("Connecting to DataBase");
            List<Beacondata> BeaconList = new List<Beacondata>();
            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string getdetailS = "SELECT Beacon_Obj_Id, BeaconId,ObjectId, ObjectType, TemperatureUpperLimit,TemperatureLowerLimit,HumidityUpperLimit,HumidityLowerLimit, Content, TemperatureAlertThreshold, HumidityAlertThreshold FROM Beacon_Object_Info WHERE ShipMasterId = @ShipMasterId";
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
            command = new SqlCommand(getdetailS, conn);
            command.Parameters.Add("@ShipMasterId", SqlDbType.Char);
            command.Parameters["@ShipMasterId"].Value = ShipMasterId;
            conn.Open();
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                Beacondata beacon = new Beacondata();
                beacon.BeaconObjectId = (int)reader["Beacon_Obj_Id"];
                beacon.BeaconID = (string)reader["BeaconId"];
                beacon.ObjectId = (string)reader["ObjectId"];
                beacon.ObjectType = (string)reader["ObjectType"];
                beacon.TemperatureMax = (double)reader["TemperatureUpperLimit"];
                beacon.TemperatureMin = (double)reader["TemperatureLowerLimit"];
                beacon.HumidityMax = (double)reader["HumidityUpperLimit"];
                beacon.HumidityMin = (double)reader["HumidityLowerLimit"];
                beacon.Content = (string)reader["Content"];
                beacon.TemperatureAlertThreshold = (int)reader["TemperatureAlertThreshold"];
                beacon.HumidityAlertThreshold = (int)reader["HumidityAlertThreshold"];


                BeaconList.Add(beacon);

            }
            reader.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(BeaconList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class Beacondata
    {
        public int BeaconObjectId { get; set; }
        public string BeaconID { get; set; }
        public string ObjectId { get; set; }
        public string ObjectType { get; set; }
        public double TemperatureMax { get; set; }
        public double TemperatureMin { get; set; }
        public double HumidityMin { get; set; }
        public double HumidityMax { get; set; }
        public string Content { get; set; }
        public int TemperatureAlertThreshold { get; set; }
        public int HumidityAlertThreshold { get; set; }
    }
}
