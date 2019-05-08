using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace CCTitanFunction
{
    public static class AddBeaconDetails
    {
        [FunctionName("AddBeaconDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Adding Beacon Details Function Triggered - {DateTime.Now}");

            // Get request body
            dynamic data = await req.Content.ReadAsAsync<object>();
            string BeaconId = data?.BeaconId;
            string ObjectId = data?.ObjectId;
            string ObjectType = data?.ObjectType;
            string Content = data?.Content;
            string TemperatureMin = data?.TemperatureMin;
            string TemperatureMax = data?.TemperatureMax;
            string HumidityMin = data?.HumidityMin;
            string HumidityMax = data?.HumidityMax;
            string ShipMasterId = data?.ShipMasterId;
            string TemperatureAlertThreshold = data?.TemperatureAlertThreshold;
            string HumidityAlertThreshold = data?.HumidityAlertThreshold;

            if (string.IsNullOrEmpty(BeaconId) || string.IsNullOrEmpty(ObjectId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            BeaconId = BeaconId.Trim();
            ObjectId = ObjectId.Trim();


            log.Info("Connecting to DataBase");

            var ConnectionstrinG = Environment.GetEnvironmentVariable("SQLConnectionString");
            string AdddetailS = "INSERT INTO Beacon_Object_Info VALUES(@BeaconId, @ObjectId, @ObjectType, @TemperatureUpperLimit, @TemperatureLowerLimit, @HumidityUpperLimit, @HumidityLowerLimit, @CreatedBy, @CreatedDateTime, @UpdatedBy, @UpdatedDateTime, @Content,  @ShipMasterId, @TemperatureAlertThreshold, @HumidityAlertThreshold)";
            SqlConnection conn = new SqlConnection(ConnectionstrinG);
            SqlCommand command;
            
            try
            {

                var qrySelectId = " SELECT b.[BeaconId] FROM [dbo].[Beacon_Object_Info] b "+
                                   " INNER JOIN[dbo].[Shipping_Master] s on b.[ShipMasterId]= s.[ShipMasterId] WHERE s.[ShipmentStatus]!='closed'" +
                                   " and[IsActive]=1  AND b.[BeaconId]= @BeaconId";
                command = new SqlCommand(qrySelectId, conn);
                command.Parameters.Clear();
                command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
                conn.Open();
                var beaconId = command.ExecuteScalar();
                conn.Close();
                if (beaconId != null)
                {
                    if (beaconId.ToString() == BeaconId)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Duplicate Beacon.Cannot insert.");
                    }
                }

                qrySelectId = " SELECT b.[ObjectId] FROM [dbo].[Beacon_Object_Info] b " +
                                " INNER JOIN[dbo].[Shipping_Master] s on b.[ShipMasterId]= s.[ShipMasterId] WHERE s.[ShipmentStatus]!='closed'" +
                                " and[IsActive]=1  AND b.[ObjectId]= @ObjectId";
                command = new SqlCommand(qrySelectId, conn);
                command.Parameters.Clear();
                command.Parameters.Add("@ObjectId", SqlDbType.NVarChar).Value = ObjectId;
                conn.Open();
                var objectId = command.ExecuteScalar();
                conn.Close();
                if (objectId != null)
                {
                    if (objectId.ToString() == ObjectId)
                    {
                        return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Duplicate ObjectId.Cannot insert.");
                    }
                }

                command = new SqlCommand(AdddetailS, conn);
                command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
                command.Parameters.Add("@ObjectId", SqlDbType.NVarChar).Value = ObjectId;
                command.Parameters.Add("@ObjectType", SqlDbType.NVarChar).Value = ObjectType;
                command.Parameters.Add("@TemperatureLowerLimit", SqlDbType.Float).Value = TemperatureMin;
                command.Parameters.Add("@TemperatureUpperLimit", SqlDbType.Float).Value = TemperatureMax;
                command.Parameters.Add("@HumidityUpperLimit", SqlDbType.Float).Value = HumidityMax;
                command.Parameters.Add("@HumidityLowerLimit", SqlDbType.Float).Value = HumidityMin;
                command.Parameters.Add("@CreatedBy", SqlDbType.NVarChar).Value = "crName";
                command.Parameters.Add("@CreatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                command.Parameters.Add("@UpdatedBy", SqlDbType.NVarChar).Value = "upName";
                command.Parameters.Add("@UpdatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                command.Parameters.Add("@Content", SqlDbType.NVarChar).Value = Content;
                command.Parameters.Add("@ShipMasterId", SqlDbType.Int).Value = ShipMasterId;
                command.Parameters.Add("@TemperatureAlertThreshold", SqlDbType.Int).Value = TemperatureAlertThreshold;
                command.Parameters.Add("@HumidityAlertThreshold", SqlDbType.Int).Value = HumidityAlertThreshold;
                conn.Open();
                command.ExecuteNonQuery();
                conn.Close();

                return req.CreateResponse(HttpStatusCode.OK, "Added Beacon details to the dB");


            }
            catch (Exception ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }

        }
    }
}
