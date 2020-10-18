using System;

namespace Domain {
    public class Photo {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public DateTime Date { get; set; }
        public string Description {get; set;}
        [Newtonsoft.Json.JsonIgnore]
        public virtual AppUser AppUser { get; set; }

    }
}