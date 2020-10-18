using Application.Errors;
using Application.Interfaces;
using Application.Photos;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext context;
        private readonly IUserAccessor userAccessor;

        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            this.context = context;
            this.userAccessor = userAccessor;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

            var currentUser = await context.Users.SingleOrDefaultAsync(x => x.UserName == userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                Phone = user.Phone,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
                profile.IsFollowed = true;

            return profile;
        }
    }
}
