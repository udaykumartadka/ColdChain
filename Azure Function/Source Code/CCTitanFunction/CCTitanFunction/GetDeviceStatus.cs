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
    public static class GetDeviceStatus
    {
        [FunctionName("GetDeviceStatus")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"C# Timer trigger function executed at: {DateTime.Now}");

            string ShipmentId = req.GetQueryNameValuePairs()
                        .FirstOrDefault(q => string.Compare(q.Key, "ShipmentId", true) == 0)
                        .Value;

            if (string.IsNullOrEmpty(ShipmentId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            var deviceStatusQry = "SELECT d.[MacId], d.[Type], d.[Status] FROM [dbo].[DeviceInfo] d" +
                            " INNER JOIN [dbo].[VW_Gateway_Pallet_ShipmentAssociation] v " +
                            " ON d.[MacId]=v.[MacId] WHERE [ShipmentID]=@ShipmentId" +
                            " UNION" +
                            " SELECT d.[MacId], d.[Type], d.[Status] FROM [dbo].[DeviceInfo] d" +
                            " INNER JOIN [dbo].[VW_Gateway_Pallet_ShipmentAssociation] v" +
                            " ON d.[deviceId]=v.[Tracker_id] WHERE [ShipmentID]=@ShipmentId" +
                            " ORDER BY d.[Type]";

            List<DeviceStatus> deviceStatuslist = new List<DeviceStatus>();
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
            command = new SqlCommand(deviceStatusQry, conn);
            command.Parameters.Add("@ShipmentId", SqlDbType.NVarChar).Value = ShipmentId;
            conn.Open();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                DeviceStatus deviceStatus = new DeviceStatus();
                deviceStatus.MacId = (string)reader["MacId"];
                deviceStatus.Type = (string)reader["Type"];
                deviceStatus.Status = (string)reader["Status"];
                deviceStatuslist.Add(deviceStatus);
            }
            reader.Close();
            conn.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(deviceStatuslist, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }


    public class DeviceStatus
    {
        public string MacId { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
    }
}
