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
    public static class DeleteUserRole
    {
        [FunctionName("DeleteUserRole")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Update User Role Function triggered... {DateTime.Now}");

            // parse query parameter
            string RoleId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "RoleId", true) == 0)
                .Value;

            if (RoleId == null)
            {
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();
                RoleId = data?.RoleId;
            }

            if (string.IsNullOrEmpty(RoleId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }
            string connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string deleteQuery = "DELETE FROM [dbo].[UserRole_Mapping] WHERE ID = @RoleId";
            try
            {
                SqlConnection conn = new SqlConnection(connectionString);
                SqlCommand command;
                command = new SqlCommand(deleteQuery, conn);

                command.Parameters.Add("@RoleId", SqlDbType.NVarChar).Value = RoleId;
                conn.Open();
                command.ExecuteNonQuery();
                conn.Close();
                return req.CreateResponse(HttpStatusCode.OK, "User Info Deleted");
            }
            catch (SqlException ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot delete due to error.");
            }

        }
    }
}
