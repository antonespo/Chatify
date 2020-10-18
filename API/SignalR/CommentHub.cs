using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Persistence;

namespace API.SignalR {
    public class CommentHub : Hub {
        private readonly IMediator mediator;
        private readonly DataContext context;
        public CommentHub (IMediator mediator, DataContext context) {
            this.context = context;
            this.mediator = mediator;
        }

        private string GetUsername () {
            return Context.User?.Claims?
                .FirstOrDefault (x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task SendComment (Create.Command command) {
            string username = GetUsername ();

            command.UserName = username;

            var comment = await mediator.Send (command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync ("ReceiveComment", comment);
        }

        public async Task AddToGroup(string groupName){
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUsername();

            // await Clients.Group(groupName).SendAsync("Send", username + " has joined the group");
        }

        public async Task RemoveFromGroup(string groupName){
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUsername();

            // await Clients.Group(groupName).SendAsync("Send", username + " has left the group");
        }
    }
}