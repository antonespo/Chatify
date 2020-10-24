using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages {
    public class Create {
        public class Command : IRequest<MessageDto> {
            public string Body { get; set; }
            public string UserName { get; set; }
            public Guid TopicId { get; set; }
        }

        public class Handler : IRequestHandler<Command, MessageDto> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper ) {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<MessageDto> Handle (Command request, CancellationToken cancellationToken) {
                var topic = await context.Topic.SingleOrDefaultAsync(x => x.Id == request.TopicId); 

                if(topic == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { topic = "Topic not found" });
                }

                var user = await context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == request.UserName);

                if (user == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { user = "User not found" });
                }

                var member = topic.Members
                    .SingleOrDefault(x => x.AppUser.UserName == request.UserName);

                if(member == null)
                {
                    var currentMember = new Member
                    {
                        AppUser = user,
                        Topic = topic
                    }; 
                    topic.Members.Add(currentMember); 
                }

                var message = new Message {
                    Body = request.Body,
                    Author = user
                };

                topic.Messages.Add(message); 

                context.Message.Add (message);
                var success = await context.SaveChangesAsync () > 0;
                if (success) {
                    return mapper.Map<Message, MessageDto>(message); 
                } else {
                    throw new Exception ("Problem saving changes");
                }

            }
        }
    }
}