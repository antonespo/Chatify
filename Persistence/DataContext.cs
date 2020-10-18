using System;
using System.Security.Cryptography.X509Certificates;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence {
    public class DataContext : IdentityDbContext<AppUser> {
        public DataContext (DbContextOptions options) : base (options) { }

        public DbSet<Activity> Activity { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<Attendee> Attendee { get; set; }
        public DbSet<Like> Like { get; set; }
        public DbSet<Photo> Photo { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

            // Attendee table
            builder.Entity<Attendee> (x => x.HasKey (ua => new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<Attendee> ()
                .HasOne (x => x.Activity)
                .WithMany (x => x.Attendee)
                .HasForeignKey (x => x.ActivityId);

            builder.Entity<Attendee> ()
                .HasOne (x => x.AppUser)
                .WithMany (x => x.Attendees)
                .HasForeignKey (x => x.AppUserId);

            // Like table
            builder.Entity<Like> (x => x.HasKey (ua => new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<Like> ()
                .HasOne (x => x.AppUser)
                .WithMany (x => x.Likes)
                .HasForeignKey (x => x.AppUserId);

            builder.Entity<Like> ()
                .HasOne (x => x.Activity)
                .WithMany (x => x.Like)
                .HasForeignKey (x => x.ActivityId);

            // Follower/following table 
            builder.Entity<UserFollowing> (
                x => x.HasKey (x => new { x.ObserverId, x.TargetId }));

            builder.Entity<UserFollowing> ()
                .HasOne (x => x.Observer)
                .WithMany (x => x.Followings)
                .HasForeignKey (x => x.ObserverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserFollowing> ()
                .HasOne (x => x.Target)
                .WithMany (x => x.Followers)
                .HasForeignKey (x => x.TargetId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}