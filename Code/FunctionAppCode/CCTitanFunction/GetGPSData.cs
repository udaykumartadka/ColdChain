using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;

namespace CCTitanFunction
{
    public static class GetGPSData
    {
        [FunctionName("GetGPSData")]
        public static HttpResponseMessage Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            string deviceid = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "deviceid", true) == 0)
        .Value;   


            //var str = ConfigurationManager.ConnectionStrings["sqldb_connection"].ConnectionString;
            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");

            var queryString = "SELECT TOP 1 TRACKERID,LATITUDE,LONGITUDE,TIMESTAMP FROM GPS_Data WHERE TRACKERID=" + deviceid + " ORDER BY ID DESC";
            log.Info(queryString);
            GPSData objGps = new GPSData();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(queryString, conn))
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        objGps.TRACKERID = (string)reader[0];
                        objGps.LATITUDE = (double)reader[1];
                        objGps.LONGITUDE = (double)reader[2];
                        objGps.TIMESTAMP = (DateTime)(reader[3]);

                    }
                    reader.Close();
                }
            }


            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objGps, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class GPSData
    {
        public string TRACKERID { get; set; }
        public double LATITUDE { get; set; }
        public double LONGITUDE { get; set; }
        public DateTime TIMESTAMP { get; set; }
    }
}
