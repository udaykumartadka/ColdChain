using System;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CCTitanFunction
{
    public static class DeleteBeaconInfo
    {
        [FunctionName("DeleteBeaconInfo")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Delete BeaconInfo function triggered.....{DateTime.Now}");

            // parse query parameter
            string BeaconObjectId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "BeaconObjectId", true) == 0)
                .Value;

            if (string.IsNullOrEmpty(BeaconObjectId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            string Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            string deleteQuery = "DELETE FROM Beacon_Object_Info WHERE Beacon_Obj_Id = @BeaconObjectId";
            try
            {
                SqlConnection conn = new SqlConnection(Connectionstring);
                SqlCommand command;
                command = new SqlCommand(deleteQuery, conn);
                conn.Open();
                command.Parameters.AddWithValue("@BeaconObjectId", SqlDbType.NVarChar).Value = BeaconObjectId;
                int rowsdeleted = command.ExecuteNonQuery();
                conn.Close();
                if (rowsdeleted == 0)
                {
                    return req.CreateErrorResponse(HttpStatusCode.BadRequest, "BeaconId cannot be deleted beacuse of association");
                }
                else
                {
                    return req.CreateResponse(HttpStatusCode.OK, "BeaconId has been deleted from DB");
                }

            }
            catch (SqlException ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot delete row because of Association");
            }
        }
    }
 }

