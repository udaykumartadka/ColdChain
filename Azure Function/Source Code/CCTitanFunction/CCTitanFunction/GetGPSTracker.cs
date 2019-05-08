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
    public static class GetGPSTracker
    {
        [FunctionName("GetGPSTracker")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string MacId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "MacId", true) == 0)
                .Value;

            if (string.IsNullOrEmpty(MacId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }


            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            var selectQry = "SELECT d.[MacId] as TrackerId FROM [DeviceInfo] d" +
                            " INNER JOIN[VW_Gateway_Pallet_ShipmentAssociation] v ON d.[DeviceId] = v.[Tracker_Id]" +
                            " WHERE v.MacId = @MacId ";


            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command = new SqlCommand(selectQry, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@MacId", SqlDbType.NVarChar).Value = MacId;
            conn.Open();
            var trackerDeviceId = command.ExecuteScalar();
            conn.Close();

            GPSTracker objTracker = new GPSTracker();
            objTracker.TarackerId = trackerDeviceId.ToString();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objTracker, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }

        public class GPSTracker
        {
            public string TarackerId { get; set; }

        }
    }
}
