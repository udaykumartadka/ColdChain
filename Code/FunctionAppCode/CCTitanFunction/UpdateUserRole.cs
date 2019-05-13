using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace CCTitanFunction
{
    public static class UpdateUserRole
    {
        [FunctionName("UpdateUserRole")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            dynamic data = await req.Content.ReadAsAsync<object>();
            string RoleId = data?.RoleId;
            string UserRole = data?.UserRole;

            if (string.IsNullOrEmpty(RoleId) || string.IsNullOrEmpty(UserRole))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            string connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string UpdateQuery = "UPDATE [dbo].[UserRole_Mapping] SET Role = @UserRole WHERE ID = @RoleId";

            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
            try
            {
                command = new SqlCommand(UpdateQuery, conn);

                command.Parameters.Add("@RoleId", SqlDbType.NVarChar).Value = RoleId;
                command.Parameters.Add("@UserRole", SqlDbType.NVarChar).Value = UserRole;

                conn.Open();
                command.ExecuteNonQuery();
                conn.Close();

                return req.CreateResponse(HttpStatusCode.OK, "User Role has been Updated");
            }
            catch (Exception ex)
            {
                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }
        }
    }
}
