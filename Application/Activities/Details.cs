using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;


            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper; 
                this.context = context;
            }

            public async Task<ActivityDto> Handle(Query request, 
                CancellationToken cancellationToken)
            {
                var activity = await context.Activity
                    .FirstOrDefaultAsync(x=>x.Id == request.Id);

                var activityToReturn = mapper.Map<Activity, ActivityDto>(activity);

                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Activity Not Found" });
                }
                else
                {
                    return activityToReturn; 
                }
            }
        }
    }
}
