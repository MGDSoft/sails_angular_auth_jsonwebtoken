/**
 * UserProfileController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


    photo: function (req, res) {

        var id = req.param('id');

        UserProfile.findOne(id).then(function (userProfile){

            UploadService.image(req.files.photo, '/user', userProfile.id + '-photo', userProfile.photo).then(function (fileUrl){

                if (!userProfile)
                    return res.invalidDataRequest('UserProfile doesnt exist');

                userProfile.photo = fileUrl;

                userProfile.save(function(err){
                    if (err)
                        return res.serverError(err);

                    return res.json(200, {photo: fileUrl});
                });

            }).fail(function(err){
                return res.serverError(err);
            });

        }).fail(function(err){
            return res.serverError(err);
        });

    }

};
