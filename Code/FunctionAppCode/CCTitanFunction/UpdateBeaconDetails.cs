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
    public static class UpdateBeaconDetails
    {
        [FunctionName("UpdateBeaconDetails")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            dynamic data = await req.Content.ReadAsAsync<object>();
            string BeaconId = data?.BeaconId;
            string BeaconObjId = data?.BeaconObjectId;
            string ObjectId = data?.ObjectId;
            string ObjectType = data?.ObjectType;
            string TemperatureMin = data?.TemperatureMin;
            string TemperatureMax = data?.TemperatureMax;
            string HumidityMin = data?.HumidityMin;
            string HumidityMax = data?.HumidityMax;
            string Content = data?.Content;
            string TemperatureAlertThreshold = data?.TemperatureAlertThreshold;
            string HumidityAlertThreshold = data?.HumidityAlertThreshold;

            string BeaconobjID = BeaconObjId;

            if (string.IsNullOrEmpty(BeaconObjId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            log.Info("Connecting to DataBase");

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            string UpdateTempHum = "UPDATE Beacon_Object_Info SET BeaconId = @BeaconId, ObjectId = @ObjectId, ObjectType = @ObjectType, TemperatureLowerLimit = @TemperatureMin, TemperatureUpperLimit = @TemperatureMax, HumidityUpperLimit = @HumidityMin, HumidityLowerLimit = @HumidityMax, Content = @Content, TemperatureAlertThreshold = @TemperatureAlertThreshold, HumidityAlertThreshold = @HumidityAlertThreshold WHERE Beacon_Obj_Id = @BeaconObjId";
            SqlConnection conn = new SqlConnection(Connectionstring);
            SqlCommand command;

            try
            {
                if (BeaconObjId == BeaconobjID)
                {
                    command = new SqlCommand(UpdateTempHum, conn);
                    command.Parameters.Add("@BeaconObjId", SqlDbType.NVarChar).Value = BeaconobjID;
                    command.Parameters.Add("@BeaconId", SqlDbType.NVarChar).Value = BeaconId;
                    command.Parameters.Add("@ObjectId", SqlDbType.NVarChar).Value = ObjectId;
                    command.Parameters.Add("@ObjectType", SqlDbType.NVarChar).Value = ObjectType;
                    command.Parameters.Add("@TemperatureMin", SqlDbType.Float).Value = TemperatureMin;
                    command.Parameters.Add("@TemperatureMax", SqlDbType.Float).Value = TemperatureMax;
                    command.Parameters.Add("@HumidityMax", SqlDbType.Float).Value = HumidityMax;
                    command.Parameters.Add("@HumidityMin", SqlDbType.Float).Value = HumidityMin;
                    command.Parameters.Add("@Content", SqlDbType.NVarChar).Value = Content;
                    command.Parameters.Add("@TemperatureAlertThreshold", SqlDbType.Int).Value = TemperatureAlertThreshold;
                    command.Parameters.Add("@HumidityAlertThreshold", SqlDbType.Int).Value = HumidityAlertThreshold;

                    conn.Open();
                    command.ExecuteNonQuery();
                    conn.Close();

                    return req.CreateResponse(HttpStatusCode.OK, "Added Beacon details to the dB");
                }
                else
                    return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the details");



            }
            catch (Exception ex)
            {

                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }
        }
    }
}
