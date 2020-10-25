using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser> {
                    new AppUser {
                    Id = "d",
                    DisplayName = "Antonio",
                    UserName = "antonio",
                    Email = "antonio@test.com",
                    Bio = "This is the bio of Antonio",
                    Gender = "Male",
                    DateOfBirth = DateTime.Now.AddYears (-25),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd7",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592066265/ixwxzgpmiuya7a6wlicg.jpg",
                    IsMain = true,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Antonio con la camicia",
                    },
                    new Photo {
                    Id = "asd8",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592065799/h4ux5pihtnujxg5h7i2q.jpg",
                    IsMain = false,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Antonio di profilo ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "c",
                    DisplayName = "Maria",
                    UserName = "maria",
                    Email = "maria@test.com",
                    Bio = "This is the bio of Maria",
                    Gender = "Female",
                    DateOfBirth = DateTime.Now.AddYears (-30),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd5",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592752163/lutdw8fbpcwjaktbfkd3.jpg",
                    IsMain = true,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Maria che ride",
                    },
                    new Photo {
                    Id = "asd6",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592752203/vegg3czvtvc37akcmfck.jpg",
                    IsMain = false,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Maria ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "a",
                    DisplayName = "Giorgio",
                    UserName = "giorgio",
                    Email = "giorgio@test.com",
                    Bio = "This is the bio of Giorgio",
                    Gender = "Male",
                    DateOfBirth = DateTime.Now.AddYears (-20),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd3",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591538719/jjorprsx8uufmfiu5ugn.jpg",
                    IsMain = true,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Giorgio che ride",
                    },
                    new Photo {
                    Id = "asd4",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591822854/eod88fdogp5jpn5caqqy.jpg",
                    IsMain = false,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Giorgio ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "b",
                    DisplayName = "Anna Maria",
                    UserName = "annamaria",
                    Email = "annamaria@test.com",
                    Bio = "This is the bio of Anna Maria",
                    Gender = "Female",
                    DateOfBirth = DateTime.Now.AddYears (-27),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd1",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591737399/bmwe8figgee9ivu126sg.jpg",
                    IsMain = true,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Anna Maria",
                    },
                    new Photo {
                    Id = "asd2",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591539123/xsuk3dobuaein4f4ad9g.jpg",
                    IsMain = false,
                    CreatedAt = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Anna Maria. Con la mia giacca. ",
                    }
                    }
                    }
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.Topic.Any())
            {
                var topics = new List<Topic>
                {
                    new Topic
                    {
                        Name = "Food",
                        Description = "In questo topic si parla solo di cibo",
                        Members = new List<Member>
                        {
                            new Member
                            {
                                AppUserId = "a"
                            },
                            new Member
                            {
                                AppUserId = "b"
                            },
                            new Member
                            {
                                AppUserId = "c"
                            }
                        },
                        Messages = new List<Message>
                        {
                            new Message
                            {
                                Body = "Ciao a tutti da Giorgio nel topic del cibo",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = ":) :) :)",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Anna Maria nel topic del cibo",
                                AuthorId = "b"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Maria nel topic del ciboooo, che buono",
                                AuthorId = "c"
                            }
                        }
                    },
                    new Topic
                    {
                        Name = "Music",
                        Description = "In questo topic si parla solo di musica",
                        Members = new List<Member>
                        {
                            new Member
                            {
                                AppUserId = "a"
                            },
                            new Member
                            {
                                AppUserId = "b"
                            },
                            new Member
                            {
                                AppUserId = "d"
                            }
                        },
                        Messages = new List<Message>
                        {
                            new Message
                            {
                                Body = "Ciao a tutti da Giorgio nel topic della musica",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = ":) :) :)",
                                AuthorId = "d"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Anna Maria nel topic della musica",
                                AuthorId = "b"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Antonio Espo nel topic pi� bello",
                                AuthorId = "d"
                            }
                        }
                    },
                    new Topic
                    {
                        Name = "Art",
                        Description = "In questo topic si parla solo di arte",
                        Members = new List<Member>
                        {
                            new Member
                            {
                                AppUserId = "a"
                            },
                            new Member
                            {
                                AppUserId = "c"
                            }
                        },
                        Messages = new List<Message>
                        {
                            new Message
                            {
                                Body = "Ciao a tutti da Giorgio nel topic dell'arte",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = ":) :) :)",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Maria nel topic dell'arte",
                                AuthorId = "c"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Maria nel topic del arteee, che bellooo",
                                AuthorId = "c"
                            }
                        }
                    },
                    new Topic
                    {
                        Name = "Theatre",
                        Description = "In questo topic si parla solo di teatro",
                        Members = new List<Member>
                        {
                            new Member
                            {
                                AppUserId = "a"
                            },
                            new Member
                            {
                                AppUserId = "b"
                            }
                        },
                        Messages = new List<Message>
                        {
                            new Message
                            {
                                Body = "Ciao a tutti da Giorgio nel topic del teatro",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = ":) :) :)",
                                AuthorId = "a"
                            },
                            new Message
                            {
                                Body = "Ciao a tutti da Anna Maria nel topic del teatro",
                                AuthorId = "b"
                            },
                            new Message
                            {
                                Body = "Ciao a tuttiiii ancora",
                                AuthorId = "b"
                            }
                        }
                    }
                }; 

                context.Topic.AddRange(topics); 
            }

            await context.SaveChangesAsync();
        }
    }
}