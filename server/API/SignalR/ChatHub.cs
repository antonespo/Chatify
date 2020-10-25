using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Messages;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Persistence;

namespace API.SignalR {
    public class ChatHub : Hub {
        private readonly IMediator mediator;
        private readonly DataContext context;

        public ChatHub (IMediator mediator, DataContext context) {
            this.mediator = mediator;
            this.context = context;
        }
        private string GetUsername () {
            return Context.User?.Claims?
                .FirstOrDefault (x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task SendMessage (Create.Command command) {
            string username = GetUsername ();

            var user = context.Users.FirstOrDefault (x => x.UserName == username);
            if (user != null) {
                command.UserName = user.UserName;
            }

            var message = await mediator.Send (command);
            await Clients.Group (command.TopicId.ToString()).SendAsync ("ReceiveMessage", message);
        }

        public async Task SendAllMessages (string topicId) {
            string username = GetUsername ();

            var res = await mediator.Send (new List.Query { TopicId = Guid.Parse( topicId)});
            await Clients.Caller.SendAsync ("ReceiveAllMessages", res);
        }

        public async Task AddToGroup (string topicIdGroup) {
            string username = GetUsername ();

            await Groups.AddToGroupAsync (Context.ConnectionId, topicIdGroup);

            await Clients.Group (topicIdGroup)
                .SendAsync ("NewViewer", $"{username} has joined the group {topicIdGroup}.");
        }

        public async Task RemoveFromGroup (string topicIdGroup) {
            string username = GetUsername ();

            await Groups.RemoveFromGroupAsync (Context.ConnectionId, topicIdGroup);

            await Clients.Group (topicIdGroup)
                .SendAsync ("Send", $"{username} has left the group {topicIdGroup}.");
        }
    }
}