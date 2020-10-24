using Application.Common;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Topics
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Topic, TopicDto>()
                .ForMember(d => d.MemberDtos,
                    o => o.MapFrom(s => s.Members));
        }
    }
}
