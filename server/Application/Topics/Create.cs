using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Followers;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Topics {
    public class Create {
        public class Command : IRequest<TopicDto> {
            public string Name { get; set; }
            public string Description { get; set; }
            public string UserName { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator () {
                RuleFor (x => x.Name).NotEmpty ();
                RuleFor (x => x.Description).NotEmpty ();
            }
        }

        public class Handler : IRequestHandler<Command, TopicDto> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper) {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<TopicDto> Handle (Command request, CancellationToken cancellationToken) {
                var existingTopic = await context.Topic.SingleOrDefaultAsync (x => x.Name == request.Name);

                if (existingTopic != null) {
                    throw new RestException (HttpStatusCode.NotFound, new { topic = "This topic already exists" });
                }

                var user = await context
                    .Users
                    .SingleOrDefaultAsync (x => x.UserName == request.UserName);

                if (user == null) {
                    throw new RestException (HttpStatusCode.NotFound, new { user = "User not found" });
                }

                var topic = new Topic {
                    Name = request.Name,
                    Description = request.Description,
                    Members = new List<Member> {
                    new Member {
                    AppUser = user
                    }
                    }
                };

                context.Topic.Add (topic);

                var success = await context.SaveChangesAsync () > 0;
                if (success) {
                    return mapper.Map<Topic, TopicDto> (topic);
                } else {
                    throw new Exception ("Problem saving changes");
                }

            }
        }
    }
}