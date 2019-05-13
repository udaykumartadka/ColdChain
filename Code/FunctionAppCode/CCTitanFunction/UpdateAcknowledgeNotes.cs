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
    public static class UpdateAcknowledgeNotes
    {
        [FunctionName("UpdateAcknowledgeNotes")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous,"post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter

            dynamic data = await req.Content.ReadAsAsync<object>();
            string IncidentId = data?.IncidentId;
            string AckNotes = data?.AckNotes;            

            if (string.IsNullOrEmpty(IncidentId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string updateQuery = "UPDATE [Alert_Process] SET [Acknowledge] = @Acknowledge, [Ack_Notes] = @AckNotes WHERE ID = @IncidentId";
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;

            try
            {                
                    command = new SqlCommand(updateQuery, conn);
                    command.Parameters.Add("@Acknowledge", SqlDbType.Bit).Value = 1;
                    command.Parameters.Add("@AckNotes", SqlDbType.NVarChar).Value = AckNotes;
                    command.Parameters.Add("@IncidentId", SqlDbType.NVarChar).Value = IncidentId;
                    conn.Open();
                    command.ExecuteNonQuery();
                    conn.Close();
                    return req.CreateResponse(HttpStatusCode.OK, "Updated Acknowledgement details");               
            }
            catch (Exception ex)
            {
                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }

        }
    }
}
