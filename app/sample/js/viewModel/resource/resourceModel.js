define([
    "jquery",
    "ko",
    "postal",
    "viewModel/resource/resourceCreateEdit",
    "text!../../../template/resource/resources.html"
    ], function($, ko, postal, resourceCreateEdit, html) {
        var viewModel = {};
        var channel = postal.channel();
        return {
            createViewModel: function() {
                viewModel.showForm = ko.observable(true);
                viewModel.resources = ko.observableArray([]);
                viewModel.editResouceClick = function(data) {
                    $.ajax({
                        type: 'GET',
                        url: '/api/resources/'+data.id,
                        dataType: 'json',
                        success: function (data) {
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
                        type: 'GET',
                        url: '/api/resources',
                        dataType: 'json',
                        success: function (data) {
                            viewModel.resources(data);
                        }
                    });
                };
                channel.subscribe("showList", function() {
                    viewModel.showForm(true);
                    viewModel.load();
                });
                channel.subscribe('changeView', function(data) {
                    if(data.view === 'resources') {
                        viewModel.showForm(true);
                        viewModel.load();
                    } else {
                        viewModel.showForm(false);
                        ko.cleanNode($('#resourceList').get(0));
                        $('#resourceList .table-responsive').remove();
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