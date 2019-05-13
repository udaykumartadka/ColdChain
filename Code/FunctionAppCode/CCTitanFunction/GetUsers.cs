using System;
using System.Collections.Generic;
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
    public static class GetUsers
    {
        private static SqlConnection conn;

        [FunctionName("GetUsers")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]HttpRequestMessage req, TraceWriter log)
        {

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");

            List<User> userList = new List<User>();

            string qrySelect = "SELECT [ID],[Username],[Email],[Role],[Status] FROM  UserRole_Mapping";
            using (conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(qrySelect, conn))
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        User objUser = new User
                        {

                            ID = (int)reader["ID"],
                            Username = reader["Username"].ToString(),
                            Email = reader["Email"].ToString(),
                            Role = reader["Role"].ToString(),
                            Status = reader["Status"].ToString()
                        };
                        userList.Add(objUser);                       
                    }
                    reader.Close();
                }
               

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(userList, Formatting.Indented), Encoding.UTF8, "application/json")
                };
            }
        }

        public class User
        {
            public int ID { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string Status { get; set; }
        }
    }
}
