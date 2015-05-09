define(["jquery", "ko", "text!../../../template/project/projects.html"], function($, ko, html) {
    var viewModel = {};
    return {
        createViewModel: function() {
            viewModel.showForm = ko.observable(true);
            viewModel.projects = ko.observableArray([]);
            viewModel.editProjectClick = function(data) {
                $.ajax({
                    type: 'GET',
                    url: '/api/projects/'+data.id,
                    dataType: 'json',
                    success: function (data) {
                        // viewModel.showForm(false);
                        console.log(data);
                    }
                });
            };
            viewModel.createProjectClick = function() {
                console.log('create project');
                // viewModel.showForm(false);
            };
            $.ajax({
                type: 'GET',
                url: '/api/projects',
                dataType: 'json',
                success: function (data) {
                    viewModel.projects(data);
                }
            });
        },
        createUI: function($parent) {
            console.log('in create ui');
            $parent.append(html);
            //apply bindings
            ko.applyBindings(viewModel, $parent.get(0));
        }
    };
});