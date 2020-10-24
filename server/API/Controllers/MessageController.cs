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
    public class MessageController : BaseController
    {
        // POST: api/message/add
        [HttpPost("add")]
        public async Task<ActionResult<Message>> Add(Create.Command command)
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