define(['backbone', 'EEye.Base'], function (backbone, base) {
	"option explicit";

	var models = base.namespace('EEye.Models');

	models.Model = backbone.Model.extend({
	});

	models.Collection = backbone.Collection.extend({
	});

	return (models);
});