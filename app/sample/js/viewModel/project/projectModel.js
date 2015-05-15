define(["jquery", "ko", "postal", "viewModel/project/projectCreateEdit", "viewModel/project/projectResource", "text!../../../template/project/projects.html"], function($, ko, postal, projectCreateEdit, projectResource, html) {
	var viewModel = {};
	var channel = postal.channel();
	return {
		createViewModel : function() {
			viewModel.showForm = ko.observable(true);
			viewModel.projects = ko.observableArray([]);
			viewModel.deleteProjectID = ko.observable();
			viewModel.deleteProjectText = ko.observable();
			viewModel.editProjectClick = function(data) {
				$.ajax({
					type : 'GET',
					url : '/api/projects/' + data.id,
					dataType : 'json',
					success : function(data) {
						viewModel.showForm(false);
						projectCreateEdit.createViewModel(data);
						projectCreateEdit.createUI($('#projectCreateEdit'));
					}
				});
			};
			viewModel.createProjectClick = function() {
				console.log('create project');
				viewModel.showForm(false);
				projectCreateEdit.createViewModel();
				projectCreateEdit.createUI($('#projectCreateEdit'));
			};
			viewModel.getProjectResource = function(data) {
				viewModel.showForm(false);
				projectResource.createViewModel(data.id);
				projectResource.createUI($('#projectResource'));
			};
			viewModel.load = function() {
				$.ajax({
					type : 'GET',
					url : '/api/projects',
					dataType : 'json',
					success : function(data) {
						viewModel.projects(data);
					}
				});
			};
			viewModel.deleteProject = function() {
				if (viewModel.deleteProjectID()) {
					$.ajax({
						type : 'DELETE',
						url : '/api/projects/' + viewModel.deleteProjectID(),
						dataType : 'json',
						success : function() {
							$('#deleteModal').modal('hide');
							viewModel.load();
						},
						error : function() {
							console.log('error');
						}
					});
				}
			};
			viewModel.deleteProjectClick = function(data) {
				viewModel.deleteProjectID(data.id);
				viewModel.deleteProjectText(data.name);
			};
			channel.subscribe('showList', function(data) {
				if (data.view === 'projects') {
					viewModel.showForm(true);
					viewModel.load();
				}
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