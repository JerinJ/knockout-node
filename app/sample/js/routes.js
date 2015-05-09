define(["sammy", "viewModel/project/projectModel", "viewModel/resource/resourceModel"], function(Sammy, projectModel, resourceModel) {
    return Sammy(function() {
        this.get('#projectList', function() {
            console.log('in projectList');
            projectModel.createViewModel();
            projectModel.createUI($('#resourceList'));
        });
        this.get('#resourceList', function() {
            console.log('in resourceList');
            resourceModel.createViewModel();
            resourceModel.createUI($('#resourceList'));
        });
    });
});