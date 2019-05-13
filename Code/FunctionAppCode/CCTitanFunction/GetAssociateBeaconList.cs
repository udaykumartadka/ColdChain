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
    public static class GetAssociateBeaconList
    {
        [FunctionName("GetAssociateBeaconList")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // parse query parameter
            string MacId = req.GetQueryNameValuePairs()
                    .FirstOrDefault(q => string.Compare(q.Key, "MacId", true) == 0)
                    .Value;

            if (string.IsNullOrEmpty(MacId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            string sprocname = "Sp_GetBeacons";

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            List<BeaconData> CCBeaconLists = new List<BeaconData>();
            SqlConnection conn = new SqlConnection(Connectionstring);
            SqlCommand command;
            SqlParameter parameteR;

            command = new SqlCommand(sprocname, conn);
            command.CommandType = CommandType.StoredProcedure;

            parameteR = command.Parameters.Add("@MacId", SqlDbType.VarChar, 100);
            parameteR.Direction = ParameterDirection.Input;
            parameteR.Value = MacId;

            conn.Open();
            SqlDataReader myReader = command.ExecuteReader();
            while (myReader.Read())
            {
                BeaconData beaconList = new BeaconData
                {

                    BeaconID = (string)myReader[0],
                    MaxTempLimit = (double)myReader[1],
                    MinTempLimit = (double)myReader[2],
                    MaxHumLimit = (double)myReader[3],
                    MinHumLimit = (double)myReader[4]
                };

                CCBeaconLists.Add(beaconList);
            }
            myReader.Close();
            conn.Close();

            GatewayBeaon ObjGatewayBeaon = new GatewayBeaon();
            //ObjGatewayBeaon.ShipmentID="ship001";
            ObjGatewayBeaon.Beacons = CCBeaconLists;

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(ObjGatewayBeaon, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }
    public class BeaconData
    {
        public string BeaconID { get; set; }
        public double MaxTempLimit { get; set; }
        public double MinTempLimit { get; set; }
        public double MaxHumLimit { get; set; }
        public double MinHumLimit { get; set; }
    }
    public class GatewayBeaon
    {      
        public List<BeaconData> Beacons { get; set; }
    }
}
