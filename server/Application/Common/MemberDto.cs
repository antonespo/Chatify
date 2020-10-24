using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common
{
    public class MemberDto
    {
        public Guid TopicId { get; set; }
        public BasicAppUser BasicAppUser { get; set; }
    }
}
