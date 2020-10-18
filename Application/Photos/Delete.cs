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
    public class Delete {
        public class Command : IRequest {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command> {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IPhotoAccessor photoAccessor;

            public Handler (DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor) {
                this.photoAccessor = photoAccessor;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Unit> Handle (Command request, CancellationToken cancellationToken) {
                var user = await context.Users.SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());

                var photo = user.Photos.FirstOrDefault (x => x.Id == request.Id);

                if (photo == null) 
                    throw new RestException(HttpStatusCode.NotFound, new { photo = "Photo not found" });

                if (photo.IsMain) 
                    throw new RestException(HttpStatusCode.BadRequest, new { photo = "You cannot delete your main photo" });

                var result = photoAccessor.DeletePhoto (photo.Id);

                if (result == null) 
                    throw new RestException(HttpStatusCode.BadRequest, new { photo = "Problem deleting the photo from the server" });

                context.Remove (photo);

                var success = await context.SaveChangesAsync () > 0;

                if (success) return Unit.Value;

                throw new Exception ("Problem saving changes");

            }
        }
    }
}