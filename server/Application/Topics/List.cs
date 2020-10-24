using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Topics
{
    public class List
    {
        public class Query : IRequest<List<TopicDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<TopicDto>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<List<TopicDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var topics = await context.Topic.ToListAsync();

                if (topics == null)
                    return null;
                else
                    return mapper.Map<List<Topic>, List<TopicDto>>(topics);
            }
        }
    }
}
