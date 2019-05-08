using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace CCTitanFunction
{
    public static class HealthStatusTimer
    {
        [FunctionName("HealthStatusTimer")]
        public static void Run([TimerTrigger("0 */60 * * * *")]TimerInfo myTimer, TraceWriter log)
        {
            var connectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var SQLconnectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            DocumentClient client = new DocumentClient(new Uri(connectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanHeartBeatCollection");

            string SqlSelect = "SELECT DISTINCT a.[MacId], a.[ShipmentID],a.[ShipmasterID],a.[Tracker_id] FROM [VW_Gateway_Pallet_ShipmentAssociation] a";

            string queryHrtBt = "";
            //and c.current_longitude = 77.6570483
            List<GatewayShipment> gatewayShipmentList = new List<GatewayShipment>();

            using (SqlConnection conn = new SqlConnection(SQLconnectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(SqlSelect, conn))
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        GatewayShipment ObjgatewayShipment = new GatewayShipment();
                        ObjgatewayShipment.MacId = (string)reader["MacId"];
                        ObjgatewayShipment.ShipmentId = (string)reader["ShipmentID"];
                        ObjgatewayShipment.ShipmasterId = (int)reader["ShipmasterId"];
                        ObjgatewayShipment.TrackerId = (int)reader["Tracker_id"];
                        gatewayShipmentList.Add(ObjgatewayShipment);
                    }
                    reader.Close();
                    conn.Close();
                }
            }

            foreach (GatewayShipment item in gatewayShipmentList)
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

                    string quryUpdateTracker = "UPDATE DeviceInfo SET Status = @Status, [HealthCheckTime]= @CheckTime WHERE DeviceId = @trackerID";
                    SqlCommand commandTracker = new SqlCommand(quryUpdateTracker, conn);
                    commandTracker.Parameters.Clear();
                    commandTracker.Parameters.Add("@trackerID", SqlDbType.Int).Value = item.TrackerId;
                    commandTracker.Parameters.Add("@Status", SqlDbType.NVarChar).Value = status;
                    commandTracker.Parameters.Add("@CheckTime", SqlDbType.DateTime).Value = DateTime.UtcNow;
                    conn.Open();
                    commandTracker.ExecuteNonQuery();
                    conn.Close();
                    string quryUpdateShipment = "";
                    if (status == "Offline")
                    { 
                    quryUpdateShipment = "UPDATE [Shipping_Master] SET [UnreachableDevice] = 1  WHERE ShipmasterID =@ShipmasterID";
                    }
                    else
                    {
                        quryUpdateShipment = "UPDATE [Shipping_Master] SET [UnreachableDevice] = 0  WHERE ShipmasterID =@ShipmasterID";
                    }
                    SqlCommand commandUnreachable = new SqlCommand(quryUpdateShipment, conn);
                    commandUnreachable.Parameters.Clear();
                    commandUnreachable.Parameters.Add("@ShipmasterID", SqlDbType.Int).Value = item.ShipmasterId;
                    conn.Open();
                    commandUnreachable.ExecuteNonQuery();
                    conn.Close();
                    log.Info("Status Changed to "+ status);


                }
            }

        }
    }

    public class GatewayShipment
    {
        public string MacId { get; set; }
        public string ShipmentId { get; set; }
        public int ShipmasterId { get; set; }
        public int TrackerId { get; set; }

    }

    public class HeartBeat
    {
        public string gatewayId { get; set; }
        public DateTime current_system_time { get; set; }
    }
}
