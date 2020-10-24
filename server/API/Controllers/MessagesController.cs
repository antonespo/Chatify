using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Messages;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseController
    {
        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<MessageDto>> Add(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        // GET: api/messages/topicId
        [HttpGet("{topicId}")]
        public async Task<ActionResult<List<MessageDto>>> CurrentUser(Guid topicId)
        {
            return await Mediator.Send(new List.Query { TopicId = topicId});
        }
    }
}