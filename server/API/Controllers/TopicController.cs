using Application.Topics;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class TopicController : BaseController
    {
        // POST: api/topic
        [HttpPost]
        public async Task<ActionResult<Topic>> Add(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        //// GET: api/user
        //[HttpGet]
        //public async Task<ActionResult<User>> CurrentUser()
        //{
        //    return await Mediator.Send(new CurrentUser.Query());
        //}
    }
}
