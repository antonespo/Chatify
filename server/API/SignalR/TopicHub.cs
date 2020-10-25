using Application.Topics;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class TopicHub : Hub
    {
        private readonly IMediator mediator;
        private readonly DataContext context;

        public TopicHub(IMediator mediator, DataContext context)
        {
            this.mediator = mediator;
            this.context = context;
        }
        private string GetUsername()
        {
            return Context.User?.Claims?
                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task CreateTopic(Create.Command command)
        {
            string username = GetUsername();

            var user = context.Users.FirstOrDefault(x => x.UserName == username);
            if (user != null)
            {
                command.UserName = user.UserName;
            }

            var topic = await mediator.Send(command);
            await Clients.All.SendAsync("ReceiveTopic", topic);
        }

        public async Task SendAllTopics()
        {
            var topics = await mediator.Send(new List.Query());
            await Clients.Caller.SendAsync("ReceiveAllTopics", topics);
        }
    }
}
