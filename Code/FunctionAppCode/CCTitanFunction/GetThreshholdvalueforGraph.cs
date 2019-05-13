using System;
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
    public static class GetThreshholdvalueforGraph
    {
        [FunctionName("GetBeaconThreshholdvalueforGraph")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"C# HTTP trigger function processed a request - {DateTime.Now}");

            // parse query parameter
            string beaconId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "BeaconId", true) == 0)
                .Value;
            log.Info("Inside beacon data");

            if (string.IsNullOrEmpty(beaconId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }
                
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            var queryString = "SELECT BeaconId,TemperatureUpperLimit,TemperatureLowerLimit,HumidityUpperLimit,HumidityLowerLimit FROM Beacon_Object_Info WHERE BeaconId= @BeaconId";
            ThreshholdValues beacon = new ThreshholdValues();
            using (SqlConnection conn = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(queryString, conn))
                {
                    cmd.Parameters.Add("@BeaconId", SqlDbType.Char);
                    cmd.Parameters["@BeaconId"].Value = beaconId;
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {                       
                        beacon.BeaconID = (string)reader[0];
                        beacon.MaxTempLimit = (double)reader[1];
                        beacon.MinTempLimit = (double)reader[2];
                        beacon.MaxHumLimit = (double)reader[3];
                        beacon.MinHumLimit = (double)reader[4];                       
                        break;
                    }
                    reader.Close();
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(beacon, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class ThreshholdValues
    {
        public string BeaconID { get; set; }
        public double MaxTempLimit { get; set; }
        public double MinTempLimit { get; set; }
        public double MaxHumLimit { get; set; }
        public double MinHumLimit { get; set; }
    }
}
