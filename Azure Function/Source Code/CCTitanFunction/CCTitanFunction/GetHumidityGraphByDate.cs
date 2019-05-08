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
    public static class GetHumidityGraphByDate
    {
        [FunctionName("GetHumidityGraphByDate")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processed a request.");
            var connectionstring = Environment.GetEnvironmentVariable("NoSQLConnectionString");
            var PrimaryKey = Environment.GetEnvironmentVariable("NoSqlPrimaryKey");
            string timeLimit = "T12:59:99.999Z";
            dynamic data = await req.Content.ReadAsAsync<object>();
            string beaconId = data?.BeaconId;
            string fromDate = data?.FromDate;
            string toDate = data?.ToDate;

            if (string.IsNullOrEmpty(beaconId) || string.IsNullOrEmpty(fromDate) || string.IsNullOrEmpty(toDate))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }
            toDate = toDate.TrimEnd() + timeLimit;

            DocumentClient client = new DocumentClient(new Uri(connectionstring), PrimaryKey);
            FeedOptions feedOptions = new FeedOptions();
            Database databaseInfo = client.CreateDatabaseQuery().Where(x => x.Id == "TitanCosmosDB").AsEnumerable().FirstOrDefault();
            string DB = databaseInfo.SelfLink;
            DocumentCollection documentCollection = new DocumentCollection { Id = "TitanTelemetryCollection" };

            var collectionlinK = UriFactory.CreateDocumentCollectionUri("TitanCosmosDB", "TitanTelemetryCollection");

            List<Humidity> objHumidityList = new List<Humidity>();

            string cosmosTelemeterySelect = "SELECT c.humidity,f.current_system_time FROM f JOIN c IN  f.sensor_Values WHERE c.sensorID = '" + beaconId + "'" +
                    " and f.current_system_time >= '" + fromDate + "' and f.current_system_time < '" + toDate + "' and c.humidity !=0 order by f.current_system_time asc";
            IQueryable<Humidity> cosTelemetry = client.CreateDocumentQuery<Humidity>(collectionlinK, cosmosTelemeterySelect);
            objHumidityList = cosTelemetry.ToList();

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(objHumidityList, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }
    }

    public class Humidity
    {
        public double humidity { get; set; }
        public DateTime current_system_time { get; set; }

    }
}
