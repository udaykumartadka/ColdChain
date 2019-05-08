using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;

namespace CCTitanFunction
{
    public static class GetStoredHumidityGraph
    {
        [FunctionName("GetStoredHumidityGraph")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            var connectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            log.Info("C# HTTP trigger function processed a request.");

            string BeaconId = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "BeaconId", true) == 0)
               .Value;

            if (string.IsNullOrEmpty(BeaconId))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }

            DocumentClient client = new DocumentClient(new Uri(connectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };
            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");
            List<StoredHumidityGraph> objHumList = new List<StoredHumidityGraph>();
            string cosmosTelemeterySelect = "SELECT TOP 100 c.humidity,f.current_system_time FROM f JOIN c IN  f.sensor_Values WHERE c.sensorID = '" + BeaconId + "' and (f.message_type='Stored_Telemetry' or f.message_type='Stored_Alert')  and c.humidity !=0 order by f.current_system_time desc";
            IQueryable<StoredHumidityGraph> cosTelemetry = client.CreateDocumentQuery<StoredHumidityGraph>(collectionlinK, cosmosTelemeterySelect);
            objHumList = cosTelemetry.ToList();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objHumList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class StoredHumidityGraph
    {
        public double humidity { get; set; }
        public DateTime current_system_time { get; set; }
    }
}
