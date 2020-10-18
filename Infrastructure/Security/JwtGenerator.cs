using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security {
    public class JwtGenerator : IJwtGenerator {
        private readonly IConfiguration configuration;
        public JwtGenerator (IConfiguration configuration) {
            this.configuration = configuration;
        }

        public string CreateToken (AppUser user) {
            // Build our list of claim, in questo caso è solo uno e c'è l'username come
            // nameId claim
            var claims = new List<Claim> {
                // Add username as NameId nel token che inviamo
                new Claim (JwtRegisteredClaimNames.NameId, user.UserName)
            };

            // generate signing credentials, è importante che questa parte non venga mai passata al client
            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (configuration["TokenKey"]));
            var creds = new SigningCredentials (key, SecurityAlgorithms.HmacSha512Signature);

            // Descriviamo il token che è fatto dalla lista di claims, una data di scadenza e gli passiamo le Signing credentials codificate
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity (claims),
                Expires = DateTime.Now.AddDays (7), // the claim expires after 7 days
                SigningCredentials = creds
            };

            // Genero il token e ritorno il token
            var tokenHandler = new JwtSecurityTokenHandler ();

            var token = tokenHandler.CreateToken (tokenDescriptor);

            return tokenHandler.WriteToken (token);
        }
    }
}