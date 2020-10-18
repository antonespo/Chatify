using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Application.Activities {
    public class ActivityDto {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }

        [JsonProperty (PropertyName = "attendees")]
        public ICollection<AttendeeDto> Attendee { get; set; }

        [JsonProperty (PropertyName = "likes")]
        public ICollection<LikeDto> Like { get; set; }

        [JsonProperty (PropertyName = "comments")]
        public ICollection<CommentDto> Comment { get; set; }
    }
}