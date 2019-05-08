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
    public static class CheckBeaconAlert
    {
        [FunctionName("CheckBeaconAlert")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string ObjectId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ObjectId", true) == 0)
                .Value;

            if (string.IsNullOrEmpty(ObjectId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }
            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
          

            BeaconAlert beacon = new BeaconAlert();
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;

            string qrySelectBeacon = "SELECT [BeaconId] FROM [dbo].[Beacon_Object_Info] WHERE [ObjectId]= @ObjectId ";
            command = new SqlCommand(qrySelectBeacon, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@ObjectId", SqlDbType.NVarChar).Value = ObjectId;
            conn.Open();
            var BeaconId = command.ExecuteScalar();

            string qrySelectTemp = "SELECT count([TemperatureAlert]) FROM[Alert_Process] where [TemperatureAlert] = 1  and [BeaconId] = @BeaconId";
            command = new SqlCommand(qrySelectTemp, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
            var tempCount = command.ExecuteScalar();


            string qrySelectHumidity = "SELECT count([HumidityAlert]) FROM[Alert_Process] where [HumidityAlert] = 1  and [BeaconId] = @BeaconId";
            command = new SqlCommand(qrySelectHumidity, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
            var humidityCount = command.ExecuteScalar();

            string qrySelectTamper = "SELECT count([TamperAlert]) FROM[Alert_Process] where [TamperAlert] = 1  and [BeaconId] = @BeaconId";
            command = new SqlCommand(qrySelectTamper, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
            var tamperCount = command.ExecuteScalar();

            string qrySelectShock = "SELECT count([ShockAlert]) FROM[Alert_Process] where [ShockAlert] = 1  and [BeaconId] = @BeaconId";
            command = new SqlCommand(qrySelectShock, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
            var shockCount = command.ExecuteScalar();

            var selectQry = "SELECT [BeaconId],[ObjectId],[ObjectType],[CONTENT],[TemperatureUpperLimit],[TemperatureLowerLimit],"+ 
                            " [HumidityUpperLimit],[HumidityLowerLimit] FROM [dbo].[Beacon_Object_Info] WHERE [BeaconId]= @BeaconId ";
            command = new SqlCommand(selectQry, conn);
            command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;

           
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {                
                beacon.BeaconId = reader["BeaconId"].ToString();
                beacon.ObjectId = reader["ObjectId"].ToString();
                beacon.ObjectType = reader["ObjectType"].ToString();
                beacon.Poduct = reader["CONTENT"].ToString();
                beacon.BeaconId = reader["BeaconId"].ToString();
                beacon.TemperatureUpperLimit = (double)reader["TemperatureUpperLimit"];
                beacon.TemperatureLowerLimit = (double)reader["TemperatureLowerLimit"];
                beacon.HumidityUpperLimit = (double)reader["HumidityUpperLimit"];
                beacon.HumidityLowerLimit = (double)reader["HumidityLowerLimit"];
                beacon.ShockAlerts = (int)shockCount;
                beacon.HumidityAlerts = (int)humidityCount;
                beacon.TamperAlerts = (int)tamperCount;
                beacon.TemperatureAlerts = (int)tempCount;
                if (beacon.ShockAlerts >0 || beacon.HumidityAlerts>0 || beacon.TamperAlerts>0 || beacon.TemperatureAlerts>0)
                { beacon.Status = "Alert"; }
                else
                { beacon.Status = "NonAlert"; }

            }

            reader.Close();
            conn.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(beacon, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class BeaconAlert
    {
        public string BeaconId { get; set; }
        public string ObjectId { get; set; }
        public string ObjectType { get; set; }
        public string Poduct { get; set; }
        public double TemperatureUpperLimit { get; set; }
        public double TemperatureLowerLimit { get; set; }
        public double HumidityUpperLimit { get; set; }
        public double HumidityLowerLimit { get; set; }
        public string Status { get; set; }
        public int HumidityAlerts { get; set; }
        public int TemperatureAlerts { get; set; }
        public int TamperAlerts { get; set; }
        public int ShockAlerts { get; set; }

    }
}
