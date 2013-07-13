# Template Info #

## Template Info Structure ##
Template objects are simple js objects which can contains following properties and methods:

		templateInfo = {
			id: function () {
				var id ="EEye.Templates." + uId.NewUId();
				return(id);
			},
			content: '{{=<% %>=}}<%textTemplate%><%={{ }}=%>',
			valueField: 'id',
			textField: 'text',
			textTemplate: function () {
				return ('{{' + this.textField + '}}');
			}
		};

id: 
content:
valueField:
textField:
textTemplate:

	var templates = namespace('EEye.Templates');
