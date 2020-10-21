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

            await context.SaveChangesAsync();
        }
    }
}