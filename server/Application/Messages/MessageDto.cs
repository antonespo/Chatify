using Application.Common;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Messages
{
    public class MessageDto
    {
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public BasicAppUser BasicAppUser { get; set; }
    }
}
