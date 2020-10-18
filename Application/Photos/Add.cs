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
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos {
    public class Add {
        public class Command : IRequest<Photo> {
            public IFormFile File { get; set; }
            public string Description { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo> {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IMapper mapper;

            public Handler (DataContext context, 
            IUserAccessor userAccessor, 
            IPhotoAccessor photoAccessor, IMapper mapper) {
                this.mapper = mapper;
                this.photoAccessor = photoAccessor;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Photo> Handle (Command request, CancellationToken cancellationToken) {
                var photoUploadResult = new PhotoUploadResult ();
                try {
                    photoUploadResult = photoAccessor.AddPhoto (request.File);
                } catch (Exception error) {
                    throw new Exception (error.Message);
                }
                var user = await context
                    .Users
                    .SingleOrDefaultAsync (x => x.UserName == userAccessor.GetCurrentUsername ());

                var photo = new Photo {
                    Id = photoUploadResult.PublicId,
                    Url = photoUploadResult.Url,
                    Date = DateTime.Now,
                    Description = request.Description,
                    AppUser = user
                };

                if (!user.Photos.Any (x => x.IsMain)) photo.IsMain = true;

                context.Photo.Add (photo);

                var success = await context.SaveChangesAsync () > 0;

                if (success) return photo;

                throw new Exception ("Problem saving changes");

            }
        }
    }
}