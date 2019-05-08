using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
namespace CCTitanFunction
{
    public static class HealthChecker
    {
        [FunctionName("HealthChecker")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");

            var connectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var SQLconnectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            DocumentClient client = new DocumentClient(new Uri(connectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
             var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanHeartBeatCollection");

            string SqlSelect = "SELECT DISTINCT a.[MacId], a.[ShipmentID],a.[ShipmasterID] FROM [VW_Gateway_Pallet_ShipmentAssociation] a";

            string queryHrtBt = "SELECT TOP 1  c.gatewayId, c.current_longitude,c.current_latitude,c.current_system_time,c.last_recorded_latitude,c.last_recorded_longitude FROM c where c.gatewayId = 'C031061830-00519'and c.current_longitude = 77.6570483 order by c.current_system_time desc";
            //and c.current_longitude = 77.6570483
            List<GatewayShipmentOld> gatewayShipmentList = new List<GatewayShipmentOld>();

            using (SqlConnection conn = new SqlConnection(SQLconnectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(SqlSelect, conn))
                {                    
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        GatewayShipmentOld ObjgatewayShipment = new GatewayShipmentOld();
                        ObjgatewayShipment.MacId = (string)reader["MacId"];
                        ObjgatewayShipment.ShipmentId = (string)reader["ShipmentID"];
                        ObjgatewayShipment.ShipmasterId= (int)reader["ShipmasterId"]; 
                        gatewayShipmentList.Add(ObjgatewayShipment);   
                    }
                    reader.Close();
                    conn.Close();
                }
            }

            foreach (GatewayShipmentOld item in gatewayShipmentList)
            {
                HeartBeat objHeartBeat = new HeartBeat();
                queryHrtBt = "SELECT TOP 1  c.gatewayId,c.current_system_time FROM c " +
                      " where c.gatewayId = '" + item.MacId + "' order by c.current_system_time desc";
                IQueryable<HeartBeat> heartBeat = client.CreateDocumentQuery<HeartBeat>(collectionlinK, queryHrtBt);
                objHeartBeat = heartBeat.ToList().SingleOrDefault();
                SqlConnection conn = new SqlConnection(SQLconnectionstring);
                if (objHeartBeat != null)
                {
                    //Updating Device Status Online or Offline.
                    string status = "Online";
                    var currentTime = DateTime.Now.ToUniversalTime();
                    var CosmosTime = objHeartBeat.current_system_time;
                    if ((currentTime - CosmosTime).TotalMinutes >= 15)
                    {
                        status = "Offline";
                    }
                    string quryUpdateDevice = "UPDATE DeviceInfo SET Status = @Status, [HealthCheckTime]= @CheckTime WHERE MacId = @gatewayID";
                    SqlCommand commandDevice = new SqlCommand(quryUpdateDevice, conn);
                    commandDevice.Parameters.Clear();
                    commandDevice.Parameters.Add("@gatewayID", SqlDbType.NVarChar).Value = objHeartBeat.gatewayId;
                    commandDevice.Parameters.Add("@Status", SqlDbType.NVarChar).Value = status;
                    commandDevice.Parameters.Add("@CheckTime", SqlDbType.DateTime).Value = DateTime.UtcNow;
                    conn.Open();
                    commandDevice.ExecuteNonQuery();
                    conn.Close();
                    log.Info("Status Changed to 'Offline'");

                }
            }


            return req.CreateResponse(HttpStatusCode.OK, "Successfully updated device status.");
        }
    }

    public class GatewayShipmentOld
    {
        public string MacId { get; set; }
        public string ShipmentId { get; set; }
        public int ShipmasterId { get; set; }

    }

    public class HeartBeatOld
    { 
        public string gatewayId { get; set; }
        public float last_recorded_latitude { get; set; }
        public float last_recorded_longitude { get; set; }
        public float current_latitude { get; set; }
        public float current_longitude { get; set; }
        public DateTime current_system_time { get; set; }
    }
}
