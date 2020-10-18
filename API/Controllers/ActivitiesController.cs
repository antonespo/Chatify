using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Persistence;
using static Application.Activities.List;

namespace API.Controllers
{

    public class ActivitiesController : BaseController
    {
        // GET: api/Activities?limit=3&offset=3&isGoing=true&category=Food&startDate=20200428
        [HttpGet]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(
            int? limit, 
            int? offset, 
            bool isGoing, 
            bool isHost, 
            string category,
            DateTime? startDate)
        {
            var res = await Mediator.Send(new List.Query(limit, offset, isGoing, isHost, category, startDate));
            return res;
        }

        // GET: api/Activities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivity(Guid id)
        {
            var res = await Mediator.Send(new Details.Query { Id = id });
            return res;
        }

        // POST: api/Activities
        [HttpPost]
        public async Task<ActionResult<ActivityDto>> PostActivity(Create.Command command)
        {
            var res = await Mediator.Send(command);
            return res;
        }

        // POST: api/Activities/5/attend
        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            var res = await Mediator.Send(new Attend.Command { Id = id });
            return res;
        }

        // DELETE: api/Activities/5/unattend
        [HttpDelete("{id}/unattend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            var res = await Mediator.Send(new Unattend.Command { Id = id });
            return res;
        }

        // POST: api/Activities/5/like
        [HttpPost("{id}/like")]
        public async Task<ActionResult<Unit>> LikeActivity(Guid id)
        {
            var res = await Mediator.Send(new LikeActivity.Command { Id = id });
            return res;
        }

        // DELETE: api/Activities/5/unlike
        [HttpDelete("{id}/unlike")]
        public async Task<ActionResult<Unit>> UnlikeActivity(Guid id)
        {
            var res = await Mediator.Send(new UnlikeActivity.Command { Id = id });
            return res;
        }

        // PUT: api/Activities/5
        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<ActivityDto>> PutActivity(Guid id, Edit.Command command)
        {
            command.Id = id;
            var res = await Mediator.Send(command);
            return res;
        }

        // DELETE: api/Activities/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<ActivityDto>> DeleteActivity(Guid id)
        {
            var command = new Delete.Command { Id = id };
            var res = await Mediator.Send(command);
            return res;
        }
    }
}