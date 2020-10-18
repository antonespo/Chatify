using System;

namespace Domain {
    public class Message {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public DateTime CreateAt { get; set; }
        public string UserName { get; set; }
    }
}