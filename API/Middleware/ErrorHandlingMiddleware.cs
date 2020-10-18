using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        // Here is described how to create a custom middleware: 
        // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write?view=aspnetcore-3.1

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(
            HttpContext httpContext, 
            ILogger<ErrorHandlingMiddleware> logger)
        {
            try
            {
                await next(httpContext);
            }catch(Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex, logger);
            }
        }

        private async Task HandleExceptionAsync(
            HttpContext httpContext, 
            Exception ex, 
            ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;

            switch (ex)
            {
                case RestException re:
                    logger.LogError(ex, "REST ERROR");
                    errors = re.Errors;
                    httpContext.Response.StatusCode = (int)re.Code;
                    break;
                case Exception e:
                    logger.LogError(e, "SERVER ERROR");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break; 

            }
            httpContext.Response.ContentType = "application/json"; 

            if ( errors != null)
            {
                var result = JsonSerializer.Serialize(new { errors });

                await httpContext.Response.WriteAsync(result);
                
            }
        }
    }
}
