# CheckBox #

## Creating CheckBox ##

	var collection = new models.Collection([
		{ id: 1, text: 'sample 1' }, 
		{ id: 2, text: 'sample 2' }
	]);

	var model = new models.Model({ text: 'sample header' });

	$(<DOM Selector>).CheckBoxList({ 
		collection: initialModel.collection, 
		model: initialModel.model, 
	});
	//Note: your jquery element should be the same as element type of the component

	var myObject = new views.CheckBoxList({ collection: collection, model: model });
	$(<DOM Selector>).html(myObject.render().$el);


## Accessing CheckBox ##

	$(<DOM Selector>).CheckBoxList().selectedValues();
	$(<DOM Selector>).data('CheckBoxList').selectedValues();
	$(<DOM Selector>).find('input[type=checkbox]:selected');
	$(<DOM Selector>).data('value');

## CheckBox Templates ##
