using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class Topic :DateTimeReference
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<Member> Members { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
    }
}
