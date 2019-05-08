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
    public static class SaveAssociation
    {
        [FunctionName("SaveAssociation")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            List<AssociatedChild> childList = new List<AssociatedChild>();

            // Get request body

            dynamic body = await req.Content.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            var parentObject = JsonConvert.DeserializeObject<AssociatedParent>(body as string);
         
            childList = parentObject?.ChildList;

            var Connectionstring = Environment.GetEnvironmentVariable("SQLConnectionString");
            SqlConnection conn = new SqlConnection(Connectionstring);
            SqlCommand command;           

            if (childList.Count() > 0)
            {
                string SqlInsert = "INSERT INTO Shipping_Association([ShipMasterID],[ShippingId],[Object_Beac_Id],[Associated_Object_Id],[ObjectType],[AssociatedType],[CreatedBy],[CreatedTime],[Status])" +
                                 " VALUES(@ShipMasterID,@ShippingId, @Object_Beac_Id,@Associated_Object_Id,@ObjectType,@AssociatedType, @CreatedBy, @CreatedDateTime, @Status)";
                conn.Open();
                foreach (AssociatedChild item in childList)
                {                  
                    command = new SqlCommand(SqlInsert, conn);
                    command.Parameters.Clear();
                    command.Parameters.Add("@ShipMasterID", SqlDbType.Int).Value = parentObject?.ShipmasterID;
                    command.Parameters.Add("@ShippingId", SqlDbType.NVarChar).Value = parentObject?.ShipmentID;
                    command.Parameters.Add("@Object_Beac_Id", SqlDbType.Int).Value = parentObject?.ParentObjectBeaconId;
                    command.Parameters.Add("@Associated_Object_Id", SqlDbType.Int).Value = item.ChildObjectBeaconId;
                    command.Parameters.Add("@ObjectType", SqlDbType.NVarChar).Value = parentObject?.ParentType;
                    command.Parameters.Add("@AssociatedType", SqlDbType.NVarChar).Value = item.ChildType;
                    command.Parameters.Add("@CreatedBy", SqlDbType.NVarChar).Value = "r";
                    command.Parameters.Add("@CreatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                    command.Parameters.Add("@Status", SqlDbType.NVarChar).Value = "Mapped";
                    
                    command.ExecuteNonQuery();
                }

            }
            conn.Close();

            SaveResponse response = new SaveResponse() { Status = "Success", Message = "Successfully Associated Objects" };

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(response, Formatting.Indented), Encoding.UTF8, "application/json")
            };
           
        }
    }

    public class AssociatedChild
    {
        public int ChildObjectBeaconId { get; set; }
        public string ChildObjectId { get; set; }
        public string ChildType { get; set; }

    }
    public class AssociatedParent
    {
        public int ShipmasterID { get; set; }
        public string ShipmentID { get; set; }
        public int  ParentObjectBeaconId { get; set; }
        public string ParentObjectId { get; set; }
        public string ParentType { get; set; }
        public List<AssociatedChild> ChildList { get; set; }
    }

    public class SaveResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }

    }


}
