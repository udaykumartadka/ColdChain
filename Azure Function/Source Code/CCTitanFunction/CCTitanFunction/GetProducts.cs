using System;
using System.Collections.Generic;
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
    public static class GetProducts
    {
        [FunctionName("GetProducts")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            // parse query parameter
            string ShipmasterId = req.GetQueryNameValuePairs()
                 .FirstOrDefault(q => string.Compare(q.Key, "ShipmasterId", true) == 0)
                 .Value;

            if (string.IsNullOrEmpty(ShipmasterId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }

            List<ShipmentProduct> ShipmentProductlist= new List<ShipmentProduct>();
            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            var selectQry = "SELECT [Product] FROM  [dbo].[Shipment_Product] WHERE [ShipMasterID] = @ShipmasterId ";
              

            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
            command = new SqlCommand(selectQry, conn);
            command.Parameters.Add("@ShipmasterId", SqlDbType.NVarChar).Value = ShipmasterId;
         
            conn.Open();
            SqlDataReader reader = command.ExecuteReader();
              while (reader.Read())
            {
                ShipmentProduct product = new ShipmentProduct();
                product.ProductName = reader["Product"].ToString();
                ShipmentProductlist.Add(product);
            }

            reader.Close();
            conn.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(ShipmentProductlist, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class ShipmentProduct
    {
        public string ProductName { get; set; }

    }
}
