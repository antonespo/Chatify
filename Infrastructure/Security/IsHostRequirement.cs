using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security {
    public class IsHostRequirement : IAuthorizationRequirement {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement> {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly DataContext context;

        public IsHostRequirementHandler (IHttpContextAccessor httpContextAccessor,
            DataContext context) {

            this.context = context;
            this.httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync (
            AuthorizationHandlerContext authContext,
            IsHostRequirement requirement) {

            var currentUserName = httpContextAccessor
                .HttpContext
                .User?
                .Claims?
                .FirstOrDefault (x => x.Type == ClaimTypes.NameIdentifier) ?
                .Value;

            var activityId = Guid.Parse (httpContextAccessor
                .HttpContext
                .Request
                .RouteValues
                .SingleOrDefault (x => x.Key == "id")
                .Value
                .ToString ());

            var activity = context.Activity.FindAsync (activityId).Result;

            var host = activity?.Attendee.FirstOrDefault (x => x.IsHost);

            if (host?.AppUser?.UserName == currentUserName)
                authContext.Succeed (requirement);

            return Task.CompletedTask;
        }
    }
}