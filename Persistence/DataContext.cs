using System;
using System.Security.Cryptography.X509Certificates;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence {
    public class DataContext : IdentityDbContext<AppUser> {
        public DataContext (DbContextOptions options) : base (options) { }

        public DbSet<Message> Message { get; set; }
        public DbSet<Photo> Photo { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating (ModelBuilder builder) {
            base.OnModelCreating (builder);

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