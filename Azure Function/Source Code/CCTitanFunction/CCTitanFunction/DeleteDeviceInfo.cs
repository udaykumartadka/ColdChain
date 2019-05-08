using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CCTitanFunction
{
    public static class DeleteDeviceInfo
    {
        [FunctionName("DeleteDeviceInfo")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Delete deviceinfo started - {DateTime.Now}");

            // parse query parameter
            string DeviceID = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "DeviceID", true) == 0)
                .Value;

            if (string.IsNullOrEmpty(DeviceID))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            string Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            string deleteQuery = "DELETE FROM DeviceInfo WHERE DeviceId = @DeviceID";
            try
            {
                SqlConnection conn = new SqlConnection(Connectionstring);
                SqlCommand command;
                command = new SqlCommand(deleteQuery, conn);
                conn.Open();
                command.Parameters.AddWithValue("@DeviceId", SqlDbType.NVarChar).Value = DeviceID;
                command.ExecuteNonQuery();
                conn.Close();

                return req.CreateResponse(HttpStatusCode.OK, "Deleted Device.");
            }
            catch (SqlException ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot delete due to error.");
            }
        }
    }
}
