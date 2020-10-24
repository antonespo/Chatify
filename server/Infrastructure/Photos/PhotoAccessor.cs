using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos {
    public class PhotoAccessor : IPhotoAccessor {
        private readonly Cloudinary cloudinary;
        private readonly CloudinarySettings cloudinarySettings;
        public PhotoAccessor (IOptions<CloudinarySettings> options) {
            cloudinarySettings = options.Value;
            var account = new Account (
                cloudinarySettings.CloudName, 
                cloudinarySettings.ApiKey, 
                cloudinarySettings.ApiSecret);
            cloudinary = new Cloudinary (account);
        }

        public PhotoUploadResult AddPhoto (IFormFile file) {
            var uploadResult = new ImageUploadResult ();

            if (file.Length > 0) {
                using (var stream = file.OpenReadStream ()) {
                    var uploadParams = new ImageUploadParams () {
                    File = new FileDescription (file.FileName, stream),
                    Transformation = new Transformation ().Height (500).Width (500)
                    .Crop ("fill").Gravity ("face").Chain ()
                    .Overlay (
                    new Layer ().PublicId ("antoniosticker"))
                    .Gravity ("south_east").X (5).Y (5)
                    .Width (80).Opacity (60).Effect ("brightness:200")
                    };
                    uploadResult = cloudinary.Upload (uploadParams);
                }
            }

            if (uploadResult.Error != null) throw new Exception (uploadResult.Error.Message);

            return new PhotoUploadResult {
                PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public string DeletePhoto (string publicId) {
            var deleteParams = new DeletionParams (publicId);

            var result = cloudinary.Destroy (deleteParams);

            return result.Result == "ok" ? result.Result : null;

        }
    }
}