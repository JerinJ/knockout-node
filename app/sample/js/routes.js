define(["ko", "sammy", "postal", "viewModel/project/projectModel", "viewModel/resource/resourceModel"], function(ko, Sammy, postal, projectModel, resourceModel) {
	var channel = postal.channel(), resourceViewModel, projectViewModel;
	channel.publish('changeView');
	return Sammy(function() {
		this.get('#projectList', function() {
			console.log('in projectList');
			projectViewModel = projectModel.createViewModel();
			projectModel.createUI($('#projectList'));
			channel.publish('changeView', {
				view : 'projects'
			});
		});
		this.get('#resourceList', function() {
			console.log('in resourceList');
			resourceViewModel = resourceModel.createViewModel();
			resourceModel.createUI($('#resourceList'));
			channel.publish('changeView', {
				view : 'resources'
			});
		});
		channel.subscribe('changeView', function(data) {
			if (data.view === 'resources') {
				resourceViewModel.showForm(true);
				resourceViewModel.load();

				// remove project binding
				if (!!projectViewModel) {
					projectViewModel.showForm(false);
					ko.cleanNode($('#projectList').get(0));
					$('#projectList .table-responsive').remove();
				}
			}
			if (data.view === 'projects') {
				projectViewModel.showForm(true);
				projectViewModel.load();

				// remove resource binding
				if (!!resourceViewModel) {
					resourceViewModel.showForm(false);
					ko.cleanNode($('#resourceList').get(0));
					$('#resourceList .table-responsive').remove();
				}
			}
		});
	});
}); 