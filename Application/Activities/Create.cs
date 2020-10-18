using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
    public class Create {
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
                RuleFor (x => x.Id).NotEmpty ();
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
            private readonly IUserAccessor userAccessor;
            private readonly IMapper mapper;

            public Handler (DataContext context, IUserAccessor userAccessor, IMapper mapper) {
                this.mapper = mapper;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<ActivityDto> Handle (Command request, CancellationToken cancellationToken) {
                var activity = new Activity {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date.ToLocalTime (),
                    City = request.City,
                    Venue = request.Venue
                };

                context.Activity.Add (activity);

                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());
                var attendee = new Attendee {
                    Activity = activity,
                    AppUser = user,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                context.Attendee.Add (attendee);

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