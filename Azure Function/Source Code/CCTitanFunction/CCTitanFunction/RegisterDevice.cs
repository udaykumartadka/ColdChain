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
    public static class RegisterDevice
    {
        [FunctionName("RegisterDevice")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req, TraceWriter log)
        {
            // Get request body
            dynamic data = await req.Content.ReadAsAsync<object>();
            string Mode = data?.Mode;
            string MacId = data?.MacId;
            string Type = data?.DeviceType;

            if (string.IsNullOrEmpty(Mode) || string.IsNullOrEmpty(MacId) || string.IsNullOrEmpty(Type))
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Value is null or empty");
            }

            string mode = Mode;
            var connectionString = Environment.GetEnvironmentVariable("SQLConnectionString");
            string insertQuery = "INSERT INTO DeviceInfo ([MacId],[Type],[IsActive],[Status],[CreatedBy],[CreatedDateTime])" +
                             " VALUES(@MacId, @Type, @IsActive, @Status,@CreatedBy, @CreatedDateTime)";

            string updateQuery = "UPDATE DeviceInfo SET MacId = @MacId, Type = @Type, UpdatedDateTime = @UpdatedDateTime, UpdatedBy = @UpdatedBy WHERE MacId = @MacId";
            string deleteQuery = "DELETE FROM DeviceInfo WHERE MacId = @MacId";
            SqlConnection conn = new SqlConnection(connectionString);
            SqlCommand command;
            try
            {
                if (mode == "New")
                {

                    string qrySelecteddevice = " SELECT MacId from [dbo].[DeviceInfo] where [MacId]= @macId";
                    SqlCommand commandSelect = new SqlCommand(qrySelecteddevice, conn);
                    commandSelect.Parameters.Clear();
                    commandSelect.Parameters.Add("@macId", SqlDbType.NVarChar).Value = MacId;
                    conn.Open();
                    var macId = commandSelect.ExecuteScalar();
                    conn.Close();
                    if (macId != null)
                    {
                        if (macId.ToString() == MacId)
                        {
                            return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Device already exists.Cannot create device.");
                        }
                    }


                    command = new SqlCommand(insertQuery, conn);


                    command.Parameters.Add("@MacId", SqlDbType.NVarChar).Value = MacId;
                    command.Parameters.Add("@Type", SqlDbType.NVarChar).Value = Type;
                    command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = 1;
                    command.Parameters.Add("@Status", SqlDbType.NVarChar).Value = "Online";
                    command.Parameters.Add("@CreatedBy", SqlDbType.NVarChar).Value = 'R';
                    command.Parameters.Add("@CreatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();

                    conn.Open();
                    command.ExecuteNonQuery();
                    conn.Close();

                    return req.CreateResponse(HttpStatusCode.OK, "New device created");
                }

                else if (mode == "Update")
                {
                    command = new SqlCommand(updateQuery, conn);
                    command.Parameters.Add("@MacId", SqlDbType.NVarChar).Value = MacId;
                    command.Parameters.Add("@Type", SqlDbType.NVarChar).Value = Type;
                    command.Parameters.Add("@UpdatedBy", SqlDbType.Int).Value = 28;
                    command.Parameters.Add("@UpdatedDateTime", SqlDbType.DateTime).Value = DateTime.Now.ToString();
                    conn.Open();
                    command.ExecuteNonQuery();
                    conn.Close();

                    return req.CreateResponse(HttpStatusCode.OK, "Details have been updated");
                }
                else if (mode == "Delete")
                {
                    command = new SqlCommand(deleteQuery, conn);
                    command.Parameters.AddWithValue("@MacId", SqlDbType.NVarChar).Value = MacId;
                    conn.Open();
                    command.ExecuteNonQuery();
                    conn.Close();

                    return req.CreateResponse(HttpStatusCode.OK, "Selected row has been deleted");
                }

                else if (mode != "New" && mode != "Update" && mode != "Delete")
                {
                    return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid Operation");
                }

                return req.CreateResponse(HttpStatusCode.OK, "Details have been Updated");

            }
            catch (Exception ex)
            {
                log.Info("Exception Occured", ex.ToString());
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Cannot Update the Table because of an Exception");
            }
        }
    }
}
