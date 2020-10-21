using System;
using System.Collections.Generic;
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

namespace Application.Profiles {
    public class Edit {
        public class Command : IRequest {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
            public string Gender { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public string Phone { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> {
            public CommandValidator () {
                RuleFor (x => x.DisplayName).NotEmpty ();
            }
        }
        public class Handler : IRequestHandler<Command> {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor) {
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken) {
                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;
                user.Gender = request.Gender;
                user.DateOfBirth = request.DateOfBirth;
                user.Phone = request.Phone;

                var success = await context.SaveChangesAsync () > 0;

                if (success) {
                    return Unit.Value;
                } else {
                    throw new Exception ("Problem editing profile form");
                }
            }
        }
    }
}