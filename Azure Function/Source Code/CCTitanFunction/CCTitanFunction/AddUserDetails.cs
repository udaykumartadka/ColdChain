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
    public static class AddUserDetails
    {
        [FunctionName("AddUserDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous,"post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // Get request body
            dynamic data = await req.Content.ReadAsAsync<object>();
            string Username = data?.Username;
            string Email = data?.Email;
            string Status = data?.Status;
            string Role = data?.Role;
            string CreatedBy = data?.CreatedBy;
      

            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Email))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            log.Info("Connecting to DataBase");

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string addQuery = "INSERT INTO UserRole_Mapping ([Username],[Email],[Role],[Status],[CreatedBy],[CreatedTime])"+ 
                               " VALUES(@Username, @Email, @Role, @Status, @CreatedBy, @CreatedTime)";
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
           

            string qrySelectUser = " SELECT email FROM  [UserRole_Mapping] where [email]= @email";
            

            try
            {

                command = new SqlCommand(qrySelectUser, conn);
                command.Parameters.Clear();
                command.Parameters.Add("@email", SqlDbType.NVarChar).Value = Email;
                conn.Open();
                var email = command.ExecuteScalar();
                conn.Close();
                if (email != null)
                {
                    if (email.ToString() == Email)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.BadRequest, "User already exists.Cannot add user.");
                    }
                }
                command = new SqlCommand(addQuery, conn);
                command.Parameters.Clear();

                command.Parameters.Add("@Username", SqlDbType.NVarChar).Value = Username;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = Email;
                command.Parameters.Add("@Role", SqlDbType.NVarChar).Value = Role ;
                command.Parameters.Add("@Status", SqlDbType.NVarChar).Value = Status;
                command.Parameters.Add("@CreatedBy", SqlDbType.NVarChar).Value = CreatedBy;
                command.Parameters.Add("@CreatedTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                conn.Open();
                command.ExecuteNonQuery();
                conn.Close();

                return req.CreateResponse(HttpStatusCode.OK, "Added User");


            }
            catch (Exception ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }
        }
    }
}
