using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
    public class Unattend {
        public class Command : IRequest {
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command> {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor) {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken) {
                var activity = await context.Activity.FindAsync (request.Id);
                if (activity == null) throw new RestException(HttpStatusCode.NotFound, new { activity = "Could not find activity" });
                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());
                var attendance = await context.Attendee.SingleOrDefaultAsync (x => x.ActivityId == activity.Id && x.AppUserId == user.Id);

                if (attendance == null) return Unit.Value;
                if (attendance.IsHost) throw new RestException(HttpStatusCode.BadRequest, new { activity = "You cannot remove yuorself as host" });
                context.Attendee.Remove (attendance);

                var success = await context.SaveChangesAsync () > 0;

                if (success) return Unit.Value;

                throw new Exception ("Problem saving changes");
            }
        }
    }
}