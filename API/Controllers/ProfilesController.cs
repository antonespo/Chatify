using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    public class ProfilesController : BaseController {
        // GET: api/Profiles/5
        [HttpGet ("{username}")]
        public async Task<ActionResult<Profile>> GetTask (string username) {
            return await Mediator.Send (new Details.Query { Username = username });
        }

        // GET: api/5/activities?predicate=future
        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<ActivityUserDto>>> GetList (string username, string predicate) {
            return await Mediator.Send (new ListActivities.Query { Username = username, Predicate = predicate });
        }

        // PUT: api/Profiles
        [HttpPut ]
        public async Task<ActionResult<Unit>> PutProfileData (Edit.Command command) {
            var res = await Mediator.Send (command);
            return res;
        }
    }
}