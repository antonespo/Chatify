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
                command.User = user;
            }

            var message = await mediator.Send (command);
            // await Clients.All.SendAsync ("ReceiveMessage", message);
            await Clients.Group ("GruppoLavoro").SendAsync ("ReceiveMessage", message);
        }

        public async Task SendAllMessages () {
            string username = GetUsername ();

            var res = await mediator.Send (new List.Query ());
            await Clients.Caller.SendAsync ("ReceiveAllMessages", res);
        }

        public async Task AddToGroup (string groupName) {
            string username = GetUsername ();

            await Groups.AddToGroupAsync (Context.ConnectionId, groupName);

            await Clients.Group (groupName)
                .SendAsync ("Send", $"{username} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup (string groupName) {
            string username = GetUsername ();

            await Groups.RemoveFromGroupAsync (Context.ConnectionId, groupName);

            await Clients.Group (groupName)
                .SendAsync ("Send", $"{username} has left the group {groupName}.");
        }
    }
}