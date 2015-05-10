define([
        "jquery",
        "ko",
        "postal",
        "viewModel/project/projectCreateEdit",
        "text!../../../template/project/projects.html"
    ], function($, ko, postal, projectCreateEdit, html) {
        var viewModel = {};
        var channel = postal.channel();
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
                viewModel.load = function() {
                    $.ajax({
                        type: 'GET',
                        url: '/api/projects',
                        dataType: 'json',
                        success: function (data) {
                            viewModel.projects(data);
                        }
                    });
                }
                channel.subscribe('showList', function(data) {
                    if(data.view === 'projects') {
                        viewModel.showForm(true);
                        viewModel.load();
                    }
                });
                channel.subscribe('changeView', function(data) {
                    if(data.view === 'projects') {
                        viewModel.showForm(true);
                        viewModel.load();
                    } else {
                        viewModel.showForm(false);
                        ko.cleanNode($('#projectList').get(0));
                        $('#projectList .table-responsive').remove();
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
    }
);