using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Text;

namespace CCTitanFunction
{
    public static class GetDeviceInfo
    {
        [FunctionName("GetDeviceInfo")]
        public static HttpResponseMessage Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            List<Deviceinfo> Info = new List<Deviceinfo>();

            string sqlQuery = "SELECT deviceid, macid, Type, Status, CreatedDateTime from deviceinfo ";

            SqlConnection conn = new SqlConnection(Connectionstring);
            SqlCommand command;
            command = new SqlCommand(sqlQuery, conn);
            conn.Open();
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                Deviceinfo device = new Deviceinfo();
                device.DeviceId = (int)reader["deviceid"];
                device.MacId = reader["macid"].ToString();
                device.DeviceType = reader["Type"].ToString();
                device.Status = reader["Status"].ToString();
                device.CreatedOn = (DateTime)reader["CreatedDateTime"];

                Info.Add(device);
            }
            reader.Close();
            conn.Close();
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(Info, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }

        public class Deviceinfo
        {
            public int DeviceId { get; set; }
            public string MacId { get; set; }
            public string DeviceType { get; set; }
            public DateTime CreatedOn { get; set; }
            public string Status { get; set; }

        }
    }
}
