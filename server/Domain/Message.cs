using System;

namespace Domain {
    public class Message : DateTimeReference{
        public Guid Id { get; set; }
        public string Body { get; set; }
        public string AuthorId { get; set; }
        public virtual AppUser Author { get; set; }
        public Guid TopicId { get; set; }
        public virtual Topic Topic { get; set; }
    }
}