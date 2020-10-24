using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Profiles;
using API.Middleware;
using API.SignalR;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Persistence;
using Swashbuckle.AspNetCore.Swagger;

namespace API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Configure Services richiamato quando in launchSettings.json sono in Development
        public void ConfigureDevelopmentServices (IServiceCollection services) {
            // Per configurare il context con LazyLoading
            services.AddDbContext<DataContext> (opt => {
                opt.UseLazyLoadingProxies ();
                opt.UseSqlServer (Configuration.GetConnectionString ("DefaultConnection"));
            });

            //Chiamo il ConfigureServices con configurazioni comuni a prod o dev
            ConfigureServices (services);
        }

        // Configure Services richiamato quando in launchSettings.json sono in Production
        public void ConfigureProductionServices (IServiceCollection services) {
            // Per configurare il context con LazyLoading
            services.AddDbContext<DataContext> (opt => {
                opt.UseLazyLoadingProxies ();
                opt.UseSqlServer (Configuration.GetConnectionString ("DefaultConnection"));
            });

            //Chiamo il ConfigureServices con configurazioni comuni a prod o dev
            ConfigureServices (services);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {

            // Per configurare l'url
            services.AddCors (opt => {
                opt.AddPolicy ("CorsPolicy", policy => {
                    policy.AllowAnyHeader ().AllowAnyMethod ().WithExposedHeaders ("WWW-Authenticate").WithOrigins ("http://localhost:3000").AllowCredentials ();
                });
            });

            // Per comnfigurare Swagger
            services.AddSwaggerGen (c => {
                c.SwaggerDoc ("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                c.CustomSchemaIds (x => x.FullName);
            });

            // Per creare istanza delle classi nelle classi che la usano
            services.AddScoped<IJwtGenerator, JwtGenerator> ();
            services.AddScoped<IUserAccessor, UserAccessor> ();
            services.AddScoped<IPhotoAccessor, PhotoAccessor> ();
            services.AddScoped<IProfileReader, ProfileReader> ();
            services.AddTransient<DataContext> ();

            // Per configurare MediatR
            services.AddMediatR (typeof (Application.Messages.Create.Handler).Assembly);

            // Per configiurare SignalR
            services.AddSignalR ();

            // Per configurare Automapper
            //services.AddAutoMapper (typeof (Application.Activities.Details.Handler));
            //services.AddScoped (provider => new MapperConfiguration (cfg => {
            //    cfg.AddProfile (new Application.Activities.MappingProfile (
            //        provider.GetService<DataContext> (),
            //        provider.GetService<IUserAccessor> ()));
            //    cfg.AddProfile (new Application.Comments.MappingProfile ());
            //}).CreateMapper ());

            // Per configurare i controller con: 
            //  - Autorizzazione su tutti gli url con token (con le opt) 
            //  - Fluent Validation in MediatR
            services
                .AddControllers (opt => {
                    var policy = new AuthorizationPolicyBuilder ().RequireAuthenticatedUser ().Build ();
                    opt.Filters.Add (new AuthorizeFilter (policy));
                })
                .AddNewtonsoftJson (options => {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

                })
                .AddFluentValidation (cfg => {
                    cfg.RegisterValidatorsFromAssemblyContaining<Application.Profiles.Edit> ();
                });

            // Per configurare Identity Core
            var builder = services.AddIdentityCore<AppUser> ();
            var identityBuilder = new IdentityBuilder (builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext> ();
            identityBuilder.AddSignInManager<SignInManager<AppUser>> ();

            // Per configurare Authorization e SignalR
            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (Configuration["TokenKey"]));
            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (opt => {
                    // Per Authorization e Authentication con token
                    opt.TokenValidationParameters = new TokenValidationParameters {
                    // Il servere deve controllare che: 
                    // la signing key deve essere corretta
                    ValidateIssuerSigningKey = true,
                    // la chiave di sicurezza deve essere corretta
                    IssuerSigningKey = key,
                    // stiamo anullando il controllo su da dove proviene url
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    // Per validare il lifetime del token
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                    };
                    // Per SignalR
                    opt.Events = new JwtBearerEvents {
                        OnMessageReceived = context => {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty (accessToken) &&
                                ((path.StartsWithSegments ("/chat")) || (path.StartsWithSegments ("/comment")))) {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            // Per aggiungere la configurazione di Cloudinary
            services.Configure<CloudinarySettings> (Configuration.GetSection ("Cloudinary"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {

            // Per usare il middleware delle exception creato
            app.UseMiddleware<ErrorHandlingMiddleware> ();

            //Per usare il middleware del delay nelle richieste http
            app.UseMiddleware<SleepMiddleware> ();

            if (env.IsDevelopment ()) {
                //app.UseDeveloperExceptionPage ();
            }

            app.UseDefaultFiles ();
            app.UseStaticFiles ();

            //app.UseHttpsRedirection();

            // Per abilitare il routing
            app.UseRouting ();

            app.UseCors ("CorsPolicy");

            // Per configurare Swagger
            app.UseSwagger ();
            app.UseSwaggerUI (c => {
                c.SwaggerEndpoint ("/swagger/v1/swagger.json", "API");
            });

            // Per usare Authentication 
            app.UseAuthentication ();

            // Per usare authorization
            app.UseAuthorization ();

            app.UseEndpoints (endpoints => {
                // Per configurare Controller
                endpoints.MapControllers ();
                // Per configiurare SignalR
                endpoints.MapHub<ChatHub> ("/chat");
                // Tutte le route non conosciute vengono indirizzate a questo controller 
                // che in particolare non fa altro che lanciare la nostra app richiamando il file in wwwroot
                //endpoints.MapFallbackToController ("Index", "Fallback");
            });

        }
    }
}