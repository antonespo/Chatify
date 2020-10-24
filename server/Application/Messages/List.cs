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

namespace Application.Messages {
    public class List {
        public class Query : IRequest<List<MessageDto>> { 
            public Guid TopicId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<MessageDto>> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper) {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<List<MessageDto>> Handle (Query request, CancellationToken cancellationToken) {
                var topic = await context.Topic.SingleOrDefaultAsync(t => t.Id == request.TopicId); 

                if (topic == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { topic = "This topic do not exist" });
                }

                var messages = topic.Messages.ToList();

                if (messages == null)
                    return null;
                else
                    return mapper.Map<List<Message>, List<MessageDto>>(messages); 
            }
        }
    }
}
