using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
    public class MappingProfile : Profile {
        private readonly DataContext context;
        private readonly IUserAccessor userAccessor;

        public MappingProfile(DataContext context, IUserAccessor userAccessor)
        {
            this.context = context;
            this.userAccessor = userAccessor;

            CreateMap<Activity, ActivityDto> ();

            CreateMap<Attendee, AttendeeDto>()
                .ForMember(d => d.Username,
                    o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName,
                    o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Image,
                    o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.IsFollowed,
                    o => o.MapFrom(s => IsFollowing(s).Result));
                
            CreateMap<Like, LikeDto> ()
                .ForMember (d => d.Username,
                    o => o.MapFrom (s => s.AppUser.UserName))
                .ForMember (d => d.DisplayName,
                    o => o.MapFrom (s => s.AppUser.DisplayName))
                .ForMember (d => d.Image,
                    o => o.MapFrom (s => s.AppUser.Photos.FirstOrDefault (x => x.IsMain).Url));
        }

        private async Task<bool> IsFollowing(Attendee source)
        {
            var currentUser = await context
                .Users
                .SingleOrDefaultAsync(x => x.UserName == userAccessor.GetCurrentUsername());

            if (currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
                return true;
            else
                return false;
        }

    }
}