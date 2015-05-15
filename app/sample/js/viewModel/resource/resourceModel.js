define(["jquery", "ko", "postal", "viewModel/resource/resourceCreateEdit", "text!../../../template/resource/resources.html"], function($, ko, postal, resourceCreateEdit, html) {
	var viewModel = {};
	var channel = postal.channel();
	return {
		createViewModel : function() {
			viewModel.showForm = ko.observable(true);
			viewModel.resources = ko.observableArray([]);
			viewModel.deleteResourceText = ko.observable();
			viewModel.deleteResourceID = ko.observable();
			viewModel.editResouceClick = function(data) {
				$.ajax({
					type : 'GET',
					url : '/api/resources/' + data.id,
					dataType : 'json',
					success : function(data) {
						viewModel.showForm(false);
						resourceCreateEdit.createViewModel(data);
						resourceCreateEdit.createUI($('#resourceCreateEdit'));
					}
				});
			};
			viewModel.createResouceClick = function() {
				viewModel.showForm(false);
				resourceCreateEdit.createViewModel();
				resourceCreateEdit.createUI($('#resourceCreateEdit'));
			};
			viewModel.load = function() {
				$.ajax({
					type : 'GET',
					url : '/api/resources',
					dataType : 'json',
					success : function(data) {
						viewModel.resources(data);
					}
				});
			};
			viewModel.deleteResourceClick = function(data) {
				var resource = data.firstName + ' ' + data.lastName;
				viewModel.deleteResourceText(resource);
				viewModel.deleteResourceID(data.id);
			};
			viewModel.deleteResource = function() {
				if (viewModel.deleteResourceID()) {
					$.ajax({
						type : 'DELETE',
						url : '/api/resources/' + viewModel.deleteResourceID(),
						dataType : 'json',
						success : function(data) {
							viewModel.load();
							$('#deleteResourceModal').modal('hide');
						}
					});
				}
			};
			channel.subscribe("showList", function() {
				viewModel.showForm(true);
				viewModel.load();
			});
			return viewModel;
		},
		createUI : function($parent) {
			console.log('in create ui');
			$parent.append(html);
			//apply bindings
			ko.applyBindings(viewModel, $parent.get(0));
		}
	};
}); 