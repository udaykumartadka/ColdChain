using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CCTitanFunction
{
    public static class GetObjectList
    {
        [FunctionName("GetObjectList")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"C# HTTP trigger function processed a request - {DateTime.UtcNow}");

            // parse query parameter
            string ObjectType = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ObjectType", true) == 0)
                .Value;

            string ShipmasterId = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "ShipmasterId", true) == 0)
                .Value;

            log.Info("Inside beacon data");

            if (string.IsNullOrEmpty(ObjectType) || string.IsNullOrEmpty(ShipmasterId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }
            List<Object> objectlist = new List<Object>();
            var ConnectionstrinG = Environment.GetEnvironmentVariable("SQLConnectionString");
            //var query = "SELECT Beacon_Obj_Id,ObjectId FROM Beacon_Object_Info where ObjectType = @ObjectType AND ShipMasterId = @ShipmentId";
            var query = "SELECT  Beacon_Obj_Id,ObjectId FROM Beacon_Object_Info where ObjectType = @ObjectType AND ShipMasterId = @ShipmasterId " +
                    "and Beacon_Obj_Id not in (SELECT [Associated_Object_Id] FROM Shipping_Association where AssociatedType = @ObjectType AND ShipMasterId = @ShipmasterId )";
            SqlConnection conn = new SqlConnection(ConnectionstrinG);
            SqlCommand commanD;
            commanD = new SqlCommand(query, conn);
            conn.Open();
            commanD.Parameters.Add("@ObjectType", SqlDbType.NVarChar);
            commanD.Parameters["@ObjectType"].Value = ObjectType;
            commanD.Parameters.Add("@ShipmasterId", SqlDbType.NVarChar);
            commanD.Parameters["@ShipmasterId"].Value = ShipmasterId;
            SqlDataReader reader = commanD.ExecuteReader();

            while (reader.Read())
            {
                Object beacObject = new Object();
                beacObject.BeaconObjId = (int)reader["Beacon_Obj_Id"];
                beacObject.ObjectiD = (string)reader["ObjectId"];
                objectlist.Add(beacObject);

            }
            reader.Close();
            conn.Close();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objectlist, Formatting.Indented), Encoding.UTF8, "application/json")
            };

        }

        public class Object
        {
            public int BeaconObjId { get; set; }
            public string ObjectiD { get; set; }
        }
    }
}
