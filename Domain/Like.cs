using System;
using System.Collections.Generic;
using System.Text;

namespace Domain
{
    public class Like
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime DateLiked { get; set; }
    }
}
