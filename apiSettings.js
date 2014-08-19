/**
 * apiSettings.js
 *
 * @description :: Reads Swagger api-docs from /static/ & spec files from /static/listings/ . Loads to sails global var
 * @docs        :: http://
 */



var fs = require('fs');
var _ = require('underscore');
//this is a comment
module.exports.apiSettings = {
    descriptors: loadDescriptors(),
    swaggerUI: loadSwaggerUI(),
    apiDocs: loadApiDocs()
};

function loadDescriptors() {
    var apiFiles = fs.readdirSync('./static/listings/');
    apiFiles = _.reject(apiFiles, function(file) {
        return file.indexOf('.') !== -1
    });

    var descriptors = {};
    _.each(apiFiles, function(apiFile) {
        var description = JSON.parse(fs.readFileSync('./static/listings/' + apiFile, 'utf-8'));
        descriptors[apiFile] = description;
    });
    return descriptors
};

function loadSwaggerUI() {
    return fs.readFileSync('./assets/swagger/index.html', 'utf-8')
};

function loadApiDocs () {
	return JSON.parse(fs.readFileSync('./static/api-docs', 'utf-8'))
};
