using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities {
    public class Edit {
        public class Command : IRequest<ActivityDto> {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator () {
                RuleFor (x => x.Title).NotEmpty ();
                RuleFor (x => x.Description).NotEmpty ();
                RuleFor (x => x.Category).NotEmpty ();
                RuleFor (x => x.Date).NotEmpty ();
                RuleFor (x => x.City).NotEmpty ();
                RuleFor (x => x.Venue).NotEmpty ();
            }
        }
        public class Handler : IRequestHandler<Command, ActivityDto> {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler (DataContext context, IMapper mapper) {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<ActivityDto> Handle (Command request, CancellationToken cancellationToken) {
                var activity = await context.Activity.FindAsync (request.Id);

                if (activity == null) {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Activity Not Found" });
                }

                activity.Title = request.Title;
                activity.Description = request.Description;
                activity.Category = request.Category;
                activity.Date = request.Date.ToLocalTime();
                activity.City = request.City;
                activity.Venue = request.Venue;

                var success = await context.SaveChangesAsync () > 0;

                if (success) {
                    return mapper.Map<Activity, ActivityDto> (activity);
                } else {
                    throw new Exception ("Problem saving changes");
                }
            }
        }
    }
}