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
    public static class GetTemperatureGraph
    {
        [FunctionName("GetTemperatureGraph")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            var connectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");

            log.Info("C# HTTP trigger function processed a request.");

            string BeaconId = req.GetQueryNameValuePairs()
               .FirstOrDefault(q => string.Compare(q.Key, "BeaconId", true) == 0)
               .Value;           


            if (string.IsNullOrEmpty(BeaconId) )
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Input is Null or Empty");

            }


            DocumentClient client = new DocumentClient(new Uri(connectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };
            //string param = "eadd3a4f3531";
            //string cosmosQuery = "SELECT TOP 1 c.temperature,c.humidity,f.current_system_time,c.humidity_alert,c.temperature_alert,c.tamper_alert FROM f JOIN c IN f.sensor_Values  WHERE c.sensorID = '"+ param + "' order by f.current_system_time desc";

            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");
            var collectionAlert = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanAlertCollection");
            List<TemperatureGraph> objTempList = new List <TemperatureGraph>();
                   
                string cosmosTelemeterySelect = "SELECT TOP 100 c.temperature,f.current_system_time FROM f JOIN c IN  f.sensor_Values WHERE c.sensorID = '" + BeaconId + "'  and c.temperature !=0 order by f.current_system_time desc";
            IQueryable<TemperatureGraph> cosTelemetry = client.CreateDocumentQuery<TemperatureGraph>(collectionlinK, cosmosTelemeterySelect);
                objTempList = cosTelemetry.ToList();
           
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objTempList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class TemperatureGraph
    {
        public double temperature { get; set; }
        public DateTime current_system_time { get; set; }

    }
}
