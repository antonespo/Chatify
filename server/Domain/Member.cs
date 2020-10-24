using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class Member :DateTimeReference
    {
        public Guid Id { get; set; }
        public Guid TopicId { get; set; }
        public virtual Topic Topic { get; set; }
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
