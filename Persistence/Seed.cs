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
                    Id = "a",
                    DisplayName = "Bob",
                    UserName = "bob",
                    Email = "bob@test.com",
                    Bio = "This is the bio of Bob",
                    Gender = "Male",
                    DateOfBirth = DateTime.Now.AddYears (-25),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd7",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592066265/ixwxzgpmiuya7a6wlicg.jpg",
                    IsMain = true,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Bob con la camicia",
                    },
                    new Photo {
                    Id = "asd8",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592065799/h4ux5pihtnujxg5h7i2q.jpg",
                    IsMain = false,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Bob di profilo ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "b",
                    DisplayName = "Jane",
                    UserName = "jane",
                    Email = "jane@test.com",
                    Bio = "This is the bio of Jane",
                    Gender = "Female",
                    DateOfBirth = DateTime.Now.AddYears (-30),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd5",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592752163/lutdw8fbpcwjaktbfkd3.jpg",
                    IsMain = true,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Jane che ride",
                    },
                    new Photo {
                    Id = "asd6",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1592752203/vegg3czvtvc37akcmfck.jpg",
                    IsMain = false,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Jane ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "c",
                    DisplayName = "Tom",
                    UserName = "tom",
                    Email = "tom@test.com",
                    Bio = "This is the bio of Tom",
                    Gender = "Male",
                    DateOfBirth = DateTime.Now.AddYears (-20),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd3",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591538719/jjorprsx8uufmfiu5ugn.jpg",
                    IsMain = true,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Tom che ride",
                    },
                    new Photo {
                    Id = "asd4",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591822854/eod88fdogp5jpn5caqqy.jpg",
                    IsMain = false,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Tom ",
                    }
                    }
                    },
                    new AppUser {
                    Id = "d",
                    DisplayName = "Antonio",
                    UserName = "antonio",
                    Email = "antonio@test.com",
                    Bio = "This is the bio of Antonio",
                    Gender = "Male",
                    DateOfBirth = DateTime.Now.AddYears (-27),
                    Phone = "3405474785",
                    Photos = new List<Photo> {
                    new Photo {
                    Id = "asd1",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591737399/bmwe8figgee9ivu126sg.jpg",
                    IsMain = true,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Antonio",
                    },
                    new Photo {
                    Id = "asd2",
                    Url = "https://res.cloudinary.com/antonespo/image/upload/v1591539123/xsuk3dobuaein4f4ad9g.jpg",
                    IsMain = false,
                    Date = DateTime.Now.AddDays (-2),
                    Description = "Descrizione di questa foto di Antonio. Con la mia giacca. ",
                    }
                    }
                    }
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.Activity.Any())
            {
                var activities = new List<Activity> {
                    new Activity {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths (-2),
                    Description = "Activity 2 months ago",
                    Category = "Drinks",
                    City = "London",
                    Venue = "Pub",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "a",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (-2)
                    }
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths (-1),
                    Description = "Activity 1 month ago",
                    Category = "Culture",
                    City = "Paris",
                    Venue = "The Louvre",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "b",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (-1)
                    },
                    new Attendee {
                    AppUserId = "a",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (-1)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "b",
                    DateLiked = DateTime.Now.AddMonths (-2)
                    },
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths (1),
                    Description = "Activity 1 month in future",
                    Category = "Music",
                    City = "London",
                    Venue = "Wembly Stadium",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "b",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (1)
                    },
                    new Attendee {
                    AppUserId = "a",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (1)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "b",
                    DateLiked = DateTime.Now.AddMonths (-2)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 2",
                    Date = DateTime.Now.AddMonths (2),
                    Description = "Activity 2 months in future",
                    Category = "Food",
                    City = "London",
                    Venue = "Jamies Italian",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "c",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (2)
                    },
                    new Attendee {
                    AppUserId = "a",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (2)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "b",
                    DateLiked = DateTime.Now.AddMonths (-2)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 3",
                    Date = DateTime.Now.AddMonths (3),
                    Description = "Activity 3 months in future",
                    Category = "Drinks",
                    City = "London",
                    Venue = "Pub",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "b",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (3)
                    },
                    new Attendee {
                    AppUserId = "c",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (3)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 4",
                    Date = DateTime.Now.AddMonths (4),
                    Description = "Activity 4 months in future",
                    Category = "Culture",
                    City = "London",
                    Venue = "British Museum",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "a",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (4)
                    }
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 5",
                    Date = DateTime.Now.AddMonths (5),
                    Description = "Activity 5 months in future",
                    Category = "Drinks",
                    City = "London",
                    Venue = "Punch and Judy",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "c",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (5)
                    },
                    new Attendee {
                    AppUserId = "b",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (5)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths (6),
                    Description = "Activity 6 months in future",
                    Category = "Music",
                    City = "London",
                    Venue = "O2 Arena",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "a",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (6)
                    },
                    new Attendee {
                    AppUserId = "b",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (6)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "b",
                    DateLiked = DateTime.Now.AddMonths (-2)
                    },
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    },
                    new Like {
                    AppUserId = "d",
                    DateLiked = DateTime.Now.AddMonths (-4)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 7",
                    Date = DateTime.Now.AddMonths (7),
                    Description = "Activity 7 months in future",
                    Category = "Travel",
                    City = "Berlin",
                    Venue = "All",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "a",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (7)
                    },
                    new Attendee {
                    AppUserId = "c",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (7)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    }
                    }
                    },
                    new Activity {
                    Title = "Future Activity 8",
                    Date = DateTime.Now.AddMonths (8),
                    Description = "Activity 8 months in future",
                    Category = "Drinks",
                    City = "London",
                    Venue = "Pub",
                    Attendee = new List<Attendee> {
                    new Attendee {
                    AppUserId = "b",
                    IsHost = true,
                    DateJoined = DateTime.Now.AddMonths (8)
                    },
                    new Attendee {
                    AppUserId = "a",
                    IsHost = false,
                    DateJoined = DateTime.Now.AddMonths (8)
                    },
                    },
                    Like = new List<Like> {
                    new Like {
                    AppUserId = "a",
                    DateLiked = DateTime.Now.AddMonths (-1)
                    },
                    new Like {
                    AppUserId = "c",
                    DateLiked = DateTime.Now.AddMonths (-3)
                    }
                    }
                    }
                };

                await context.Activity.AddRangeAsync(activities);
                await context.SaveChangesAsync();
            }
        }
    }
}