using Microsoft.Azure.ActiveDirectory.GraphClient;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CCTitanFunction
{
    public static class GetUsersAD
    {
        [FunctionName("GetUsersAD")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Getting Users from Azure AD... {DateTime.Now}");
            var ClientId = Environment.GetEnvironmentVariable("ClientID");
            var ClientSecret = Environment.GetEnvironmentVariable("clientSecret");
            var TenantId = Environment.GetEnvironmentVariable("TenantID");
            var AuthString = Environment.GetEnvironmentVariable("authString");
            var GraphApi = Environment.GetEnvironmentVariable("resAzureGraphAPI");

            Uri uri = new Uri(GraphApi);
            Uri serviceRoot = new Uri(uri, TenantId);
            ActiveDirectoryClient adClient = new ActiveDirectoryClient(
                serviceRoot,
                async () => await GetAppTokenAsync(AuthString, ClientId, ClientSecret, GraphApi));

            List<UserAD> userDetails = new List<UserAD>();
            var users = adClient.Users.ExecuteAsync().Result.CurrentPage.ToList().Take(20);
            foreach (var UseraD in users)
            {
                var user = UseraD as User;
                UserAD adUseR = new UserAD()
                {
                    Name = user.DisplayName,
                    Email = user.Mail,
                };
                userDetails.Add(adUseR);
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(userDetails, Formatting.Indented), Encoding.UTF8, "application/json")
            };
        }

        private static async Task<string> GetAppTokenAsync(string AuthString, string ClientId, string ClientSecret, string GraphApi)
        {

           AuthenticationContext authenticationContext = new AuthenticationContext(AuthString, false);

            ClientCredential clientCred = new ClientCredential(ClientId, ClientSecret);

            AuthenticationResult authenticationResult = await authenticationContext.AcquireTokenAsync(GraphApi, clientCred);

            return authenticationResult.AccessToken;
        }

    }

    internal class UserAD
    {
        public string Name { get; set; }
        public string Email { get; set; }

    }
}
