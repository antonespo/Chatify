using Application.Topics;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class TopicsController : BaseController
    {
        // POST: api/topics
        [HttpPost]
        public async Task<ActionResult<TopicDto>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        // GET: api/topics
        [HttpGet]
        public async Task<ActionResult<List<TopicDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }
    }
}
