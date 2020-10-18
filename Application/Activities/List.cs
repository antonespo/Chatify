using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities {
    public class List {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelope> {
            public Query(int? limit, int? offset, bool isGoing, bool isHost, string category, DateTime? startDate)
            {
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
                Category = category; 
                Limit = limit;
            }

            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; }
            public bool IsHost { get; }
            public string Category { get; }
            public DateTime? StartDate { get; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope> {
            private readonly DataContext context;
            private readonly ILogger<List> logger;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler (DataContext context, 
                ILogger<List> logger, 
                IMapper mapper,
                IUserAccessor userAccessor) {
                this.context = context;
                this.logger = logger;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<ActivitiesEnvelope> Handle (
                Query request, 
                CancellationToken cancellationToken) {
                var queryable = context
                    .Activity
                    .Where(a=>a.Date >= request.StartDate)
                    .OrderBy(a=> a.Date)
                    .AsQueryable();

                if(request.IsHost)
                {
                    queryable = queryable
                        .Where(x => x.Attendee.Any(
                            a => a.AppUser.UserName == userAccessor.GetCurrentUsername() 
                            && a.IsHost));
                }

                if(request.IsGoing)
                {
                    queryable = queryable
                        .Where(x => 
                        x.Attendee
                        .Any(a => a.AppUser.UserName == userAccessor.GetCurrentUsername()));
                }

                if(!String.IsNullOrEmpty(request.Category))
                {
                    queryable = queryable
                        .Where(x => x.Category == request.Category);
                }

                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3)
                    .ToListAsync ();

                return new ActivitiesEnvelope
                {
                    Activities = mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}

