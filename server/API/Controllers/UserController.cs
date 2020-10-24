using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    public class UserController : BaseController {
        // POST: api/user/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            var res = await Mediator.Send(query);
            return res;
        }

        // POST: api/user/register
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            var res = await Mediator.Send(command);
            return res;
        }

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser () {
            return await Mediator.Send (new CurrentUser.Query ());
        }
    }
}