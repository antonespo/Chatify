using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments {
    public class Create {
        public class Command : IRequest<CommentDto> {
            public Guid ActivityId { get; set; }
            public string Body { get; set; }
            public string UserName { get; set; }

        }

        public class Handler : IRequestHandler<Command, CommentDto> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper) {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<CommentDto> Handle (Command request, CancellationToken cancellationToken) {
                var activity = await context.Activity.FindAsync (request.ActivityId);

                if (activity == null) throw new RestException (HttpStatusCode.NotFound, new { comment = "Activity not found" });

                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == request.UserName);

                var comment = new Comment {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    CreatedAt = DateTime.Now
                };

                activity.Comment.Add (comment);

                var success = await context.SaveChangesAsync () > 0;
                if (success) {
                    return mapper.Map<Comment, CommentDto> (comment);
                } else {
                    throw new Exception ("Problem saving changes");
                }

            }
        }
    }
}