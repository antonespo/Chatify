using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Messages {
    public class Create {
        public class Command : IRequest<Message> {
            public string Body { get; set; }
            public AppUser User { get; set; }
        }

        public class Handler : IRequestHandler<Command, Message> {
            private readonly DataContext context;

            public Handler (DataContext context) {
                this.context = context;
            }

            public async Task<Message> Handle (Command request, CancellationToken cancellationToken) {
                var message = new Message {
                    Body = request.Body,
                    UserName = request.User.UserName
                };

                context.Message.Add (message);
                var success = await context.SaveChangesAsync () > 0;
                if (success) {
                    return message;
                } else {
                    throw new Exception ("Problem saving changes");
                }

            }
        }
    }
}