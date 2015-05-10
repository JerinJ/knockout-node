define(["sammy", "postal", "viewModel/project/projectModel", "viewModel/resource/resourceModel"], function(Sammy, postal, projectModel, resourceModel) {
    var channel = postal.channel();
    return Sammy(function() {
        this.get('#projectList', function() {
            console.log('in projectList');
            projectModel.createViewModel();
            projectModel.createUI($('#projectList'));
            channel.publish('changeView', {view: 'projects'});
        });
        this.get('#resourceList', function() {
            console.log('in resourceList');
            resourceModel.createViewModel();
            resourceModel.createUI($('#resourceList'));
            channel.publish('changeView', {view: 'resources'});
        });
    });
});