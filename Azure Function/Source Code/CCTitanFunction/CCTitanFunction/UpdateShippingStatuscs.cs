using System;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace CCTitanFunction
{
    public static class UpdateShippingStatuscs
    {
        [FunctionName("UpdateShippingStatus")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter

            dynamic data = await req.Content.ReadAsAsync<object>();
            string ShipmentId = data?.ShipmentId;
            string ShippingStatus = data?.ShippingStatus;

            if (string.IsNullOrEmpty(ShipmentId) || string.IsNullOrEmpty(ShippingStatus))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string updateQuery = "UPDATE [dbo].[Shipping_Master]  SET [ShipmentStatus] = @ShipmentStatus, [IsActive] = @IsActive WHERE [ShipmentID] = @ShipmentID";
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;

            try
            {
                command = new SqlCommand(updateQuery, conn);
                if (ShippingStatus.ToLower().Trim() == "closed" || ShippingStatus.ToLower().Trim() == "abandoned")
                {
                    command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = 0;
                }
                else
                {
                    command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = 1;
                }
                
                command.Parameters.Add("@ShipmentStatus", SqlDbType.NVarChar).Value = ShippingStatus;
                command.Parameters.Add("@ShipmentID", SqlDbType.NVarChar).Value = ShipmentId;
                conn.Open();
                command.ExecuteNonQuery();
                conn.Close();
                return req.CreateResponse(HttpStatusCode.OK, "Updated Shippingstatus");
            }
            catch (Exception ex)
            {
                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }
        }
    }
}
