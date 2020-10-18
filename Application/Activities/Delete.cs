using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities {
    public class Delete {
        public class Command : IRequest<ActivityDto> {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, ActivityDto> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper) {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<ActivityDto> Handle (Command request, CancellationToken cancellationToken) {
                var activity = await context.Activity.FindAsync (request.Id);

                if (activity == null) {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Activity Not Found" });
                }

                context.Remove (activity);

                var success = await context.SaveChangesAsync () > 0;

                if (success) {
                    return mapper.Map<Activity, ActivityDto> (activity);;
                } else {
                    throw new Exception ("Problem saving changes");
                }
            }
        }
    }
}