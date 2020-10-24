using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
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

        // Override the save changes function to update automatically the timestamp in the tables
        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is DateTimeReference && (
                e.State == EntityState.Added));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added &&
                    (((DateTimeReference)entityEntry.Entity).CreatedAt == default(DateTime)))
                {
                    ((DateTimeReference)entityEntry.Entity).CreatedAt = DateTime.Now;
                }
            }
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is DateTimeReference && (
                e.State == EntityState.Added));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added &&
                    (((DateTimeReference)entityEntry.Entity).CreatedAt == default(DateTime)))
                {
                    ((DateTimeReference)entityEntry.Entity).CreatedAt = DateTime.Now;
                }
            }
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
    }
}