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
    public static class GetGroupUsers
    {
        [FunctionName("GetGroupUsers")]
        public static HttpResponseMessage Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            log.Info($"Getting Users from Azure AD... {DateTime.Now}");
            var ClientId = Environment.GetEnvironmentVariable("ClientID");
            var ClientSecret = Environment.GetEnvironmentVariable("clientSecret");
            var TenantId = Environment.GetEnvironmentVariable("TenantID");
            var AuthString = Environment.GetEnvironmentVariable("authString");
            var GraphApi = Environment.GetEnvironmentVariable("resAzureGraphAPI");
            var GroupId = Environment.GetEnvironmentVariable("UserGroupID");

            Uri uri = new Uri(GraphApi);
            Uri serviceRoot = new Uri(uri, TenantId);
            ActiveDirectoryClient adClient = new ActiveDirectoryClient(
                  serviceRoot,
            async () => await GetAppTokenAsync(AuthString, ClientId, ClientSecret, GraphApi));

            List<GroupUser> groupUsers = new List<GroupUser>();

            var group = adClient.Groups.GetByObjectId(GroupId).Members.ExecuteAsync().Result.CurrentPage.ToList();

            foreach (var gUsers in group)
            {
                var grUser = gUsers as User;

                GroupUser grpUser = new GroupUser()
                {
                    Name = grUser.DisplayName,
                    Email = grUser.Mail
                };

                groupUsers.Add(grpUser);
            }

            if (groupUsers != null)
            {
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(groupUsers, Formatting.Indented), Encoding.UTF8, "application/json")
                };
            }
            else
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot get Users from AD Group, please check your code..");
            }
        }

        private static async Task<string> GetAppTokenAsync(string AuthString, string ClientId, string ClientSecret, string GraphApi)
        {
            AuthenticationContext authenticationContext = new AuthenticationContext(AuthString, false);

            ClientCredential clientCred = new ClientCredential(ClientId, ClientSecret);

            AuthenticationResult authenticationResult = await authenticationContext.AcquireTokenAsync(GraphApi, clientCred);

            return authenticationResult.AccessToken;
        }
    }

    internal class GroupUser
    {
        public string Name { get; set; }
        public string Email { get; set; }

    }
}
