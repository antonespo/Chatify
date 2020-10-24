using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Application.Photos;
using Domain;

namespace Application.Profiles {
    public class Profile {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public string Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Phone { get; set; }
        public bool IsFollowed { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}