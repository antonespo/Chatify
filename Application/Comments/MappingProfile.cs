using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AutoMapper;
using Domain;
using Persistence;

namespace Application.Comments {
    public class MappingProfile : Profile {
        public MappingProfile () {
            CreateMap<Comment, CommentDto> ()
                .ForMember (d => d.Username, o => o.MapFrom (s => s.Author.UserName))
                .ForMember (d => d.DisplayName, o => o.MapFrom (s => s.Author.DisplayName))
                .ForMember (d => d.Image, o => o.MapFrom (s => s.Author.Photos.FirstOrDefault (x => x.IsMain).Url));
        }
    }
}