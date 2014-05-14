/**
 * ComponentController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {
	/*createComponent populates fusion_composites (mySQL) and precursors simultaneously. */
    createComponent: function(req, res) {
    	var errObj =[];
    	var values = req.body;
    	console.log(req.body);
        async.waterfall([
                function(callback) {
                    Precursor.create({
                    	imageName:_.first(_.last(values.path.split('/')).split('.')),
                        path: values.path,
                        starRating: values.starRating,
                        tags: values.tags
                    })
                    .exec(function(err, precursor) {
                    	if (err) {
                    		errObj.push({precursorCreate:err});
                    		console.log(err);
                    		callback(true);
                    	} else{
                    		console.log("created precursor " + precursor.id)
                       		callback(null, precursor);
                    	};
                    })
                },
                function(precursor, callback) {
                    Component.create({
                        imagePath: precursor.path.b,
                        precursor: precursor.id,
                        keywords:values.keywords,
                        componentType:values.componentType
                    }).exec(function(err, component) {
                        if (err) {
                        	errObj.push({componentCreate:err});
                        	callback(true);
                        } else {
                        	console.log("created component " + component.componentID)
                        	callback(null, component.precursor);
                        }
                    })

                },
                function(precursorID, callback) {
                	Component
                		.findOne({precursor:precursorID})
                		.exec(function(err, component) {
                			if (err) {
                				errObj.push({componentFind:err});
                        		callback(true);
                        	} else{
                        		console.log("found component " + component.componentID);
                        		callback(null, {"componentID":component.componentID, "precursorID":precursorID});
                        	}
                		});	
                },
                function(iDs, callback) {
                	Precursor
                		.update({"id":iDs.precursorID},{"componentID":iDs.componentID}, function(err, precursor) {
                			if (err) {
                				errObj.push({precursorUpdate:err});
                				callback(true);
                			} else{
                				console.log("found component " + precursor.id);
                				callback(null, iDs);
                			};
                		})
                },
                function(iDs, callback) {
                	Component
                		.find({"id":iDs.componentID})
                		.populate('precursor')
                		.exec(function(err, component) {
                			if (err) {
                				errObj.push({findComponent:err});
                				callback(true);
                			} else{
                				console.log("found component " + component.componentID);
                				callback(null, component);
                			};
                		})
                }
            ],
            function(err, component) {
                return res.json({"ERR":errObj, "OK":component});
            })
    }	
};

function componentFormatter (argument) {
	// body...
}
