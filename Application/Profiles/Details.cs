using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Photos;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles {
    public class Details {
        public class Query : IRequest<Profile> {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile> {
            private readonly IProfileReader profileReader;

            public Handler (IProfileReader profileReader) {
                this.profileReader = profileReader;
            }

            public async Task<Profile> Handle (Query request, CancellationToken cancellationToken) {
                var profile = await profileReader.ReadProfile(request.Username);

                if (profile == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Profile = "Could not find this profile" }); 
                
                return profile;
            }
        }
    }
}