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
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos {
    public class SetMain {
        public class Command : IRequest {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command> {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IMapper mapper;

            public Handler (DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor, IMapper mapper) {
                this.mapper = mapper;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken) {
                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());

                var photo = user.Photos.FirstOrDefault (x => x.Id == request.Id);

                if (photo == null) throw new RestException(HttpStatusCode.NotFound, new { photo = "Photo Not Found" });

                var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);

                if ( photo == currentMain) throw new RestException(HttpStatusCode.BadRequest, new { photo = "Photo is already the main photo"});

                currentMain.IsMain = false; 

                photo.IsMain = true; 

                var success = await context.SaveChangesAsync () > 0;

                if (success) return Unit.Value;

                throw new Exception ("Problem saving changes");

            }
        }
    }
}