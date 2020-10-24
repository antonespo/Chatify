using System;

namespace Domain {
    public class Photo : DateTimeReference {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string Description {get; set;}
        public string AppUserId { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        public virtual AppUser AppUser { get; set; }
    }
}