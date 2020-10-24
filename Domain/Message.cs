using System;

namespace Domain {
    public class Message : DateTimeReference{
        public Guid Id { get; set; }
        public string Body { get; set; }
        public string UserName { get; set; }
    }
}