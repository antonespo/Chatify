using Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Topics
{
    public class TopicDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<MemberDto> MemberDtos { get; set; }
    }
}
