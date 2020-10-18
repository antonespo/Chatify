using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
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

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await context.Users
                    .SingleOrDefaultAsync(x => x.UserName == userAccessor.GetCurrentUsername());

                var target = await context.Users
                    .SingleOrDefaultAsync(x => x.UserName == request.UserName);

                if (target == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

                var following = await context.Followings
                    .SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

                if (following != null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are already following this user" }); 

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    context.Followings.Add(following);
                }

                var success = await context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value; 
                else
                    throw new Exception("Problem saving changes");

            }
        }
    }
}