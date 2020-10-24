using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, BasicAppUser>()
                .ForMember(d => d.Image,
                    o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Member, MemberDto>()
               .ForMember(d => d.BasicAppUser,
                   o => o.MapFrom(s => s.AppUser));

        }
    }
}
