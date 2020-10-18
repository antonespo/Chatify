using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API.Middleware {
    public class SleepMiddleware {
        private readonly RequestDelegate next;
        // Here is described how to create a custom middleware: 
        // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write?view=aspnetcore-3.1

        public SleepMiddleware (RequestDelegate next) {
            this.next = next;
        }

        public async Task InvokeAsync (
            HttpContext httpContext) {
            await Task.Delay (1000);
            await next (httpContext);
        }
    }
}