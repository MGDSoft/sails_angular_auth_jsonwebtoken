var fs = require('fs')
    , Q = require("q")
    , path = require('path')
    , mkdirp = require('mkdirp')
;

module.exports = {

    image: function(dataFile, imageRelativePath, imageNameFile, oldPhotoRelativePath)
    {
        var deferred = Q.defer();

        var ext=getValidImageType(dataFile.type);

        if (!ext)
        {
            deferred.reject(new Error('Invalid image extension'));
            return deferred.promise;
        }

        var imageUrlRelative =  imageRelativePath + '/' + imageNameFile + ext,
            imagePath = path.resolve(sails.config.paths.uploads + imageRelativePath),
            imageFullPath= path.resolve( imagePath + '/' + imageNameFile + ext)
        ;

        fs.readFile(dataFile.path, function (err, data) {

            if (err)
            {
                deferred.reject(new Error(err));
            }else{
                mkdirp(imagePath, function (err) {

                    if (err)
                    {
                        deferred.reject(new Error(err));
                    }else{
                        fs.writeFile(imageFullPath, data, function (err) {

                            if (err){
                                deferred.reject(new Error(err));
                            }else{
                                deleteOldPhotoIfItIsDifferent(oldPhotoRelativePath, imageFullPath);

                                sails.log.debug('UserProfile new image '+imageFullPath);

                                deferred.resolve(imageUrlRelative);
                            }
                        });
                    }
                });
            }
        });

        return deferred.promise;
    }

};

function getValidImageType(fileExtension)
{
    console.log(fileExtension);

    var ext=null;

    switch (fileExtension)
    {
        case 'image/png':
            ext= '.png';
            break;
        case 'image/gif':
            ext= '.gif';
            break;
        case 'image/jpg':
        case 'image/jpeg':
            ext= '.jpg';
            break;
    }

    return ext;
}

function deleteOldPhotoIfItIsDifferent(oldPhotoRelativePath, imageFullPath)
{
    var oldPhotoFullPath = path.resolve(sails.config.paths.uploads + oldPhotoRelativePath);

    if (oldPhotoFullPath != imageFullPath)
    {
        fs.exists(oldPhotoFullPath, function(exists) {
            if (exists) {
                fs.unlinkSync(oldPhotoFullPath);
                sails.log.debug('UserProfile deleted old image '+oldPhotoFullPath);
            }
        });
    }

    return true;
}