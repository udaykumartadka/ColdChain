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
    public static class GetUserRoles
    {
        [FunctionName("GetUserRoles")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            string emailId = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "EmailId", true) == 0)
               .Value;

            if (string.IsNullOrEmpty(emailId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }
            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection conn = new SqlConnection(Connectionstring);
            UserRole userRole = new UserRole();

            string qrySelectBeacon = "SELECT [Role] from [dbo].[UserRole_Mapping] where email= @emailId ";
            SqlCommand command = new SqlCommand(qrySelectBeacon, conn);
            command.Parameters.Clear();
            command.Parameters.Add("@emailId", SqlDbType.NVarChar).Value = emailId;
            conn.Open();
            userRole.Role = command.ExecuteScalar().ToString();
            conn.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(userRole, Formatting.Indented), Encoding.UTF8, "application/json")
            };

        }
    }

    public class UserRole
    {        
        public string Role { get; set; }
   
    }
}
