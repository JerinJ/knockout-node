define([
    "jquery",
    "ko",
    "postal",
    "text!../../../template/project/projectResource.html"
    ], function($, ko, postal, html) {
        var viewModel = {};
        var channel = postal.channel();
        return {
            createViewModel: function(projectId) {
                viewModel.showForm = ko.observable(true);
                viewModel.resources = ko.observableArray([]);
                viewModel.notProjectResources = ko.observableArray([]);
                viewModel.removeResourceText = ko.observable();
                viewModel.removeResourceID = ko.observable();
                viewModel.addResouceClick = function() {
                    if(projectId) {
                        var data = {
                            eid: $('#addResource :selected').attr('value')
                        };
                        $.ajax({
                            url: '../api/projects/' + projectId + '/resources',
                            type: 'POST',
                            contentType: 'application/json',
                            dataType: 'json',
                            data: JSON.stringify(data)
                        }).done(function() {
                            viewModel.load();
                        }).fail(function() {
                            console.log("error");
                        });
                    }
                };
                viewModel.load = function() {
                    if (projectId) {
                        $.ajax({
                            type: 'GET',
                            url: '/api/projects/' + projectId + '/resources',
                            dataType: 'json',
                            success: function (data) {
                                viewModel.resources(data);
                            }
                        });
                        $.ajax({
                            type: 'GET',
                            url: '/api/projects/' + projectId + '/getNotProjectResources',
                            dataType: 'json',
                            success: function (data) {
                                viewModel.notProjectResources(data);
                            }
                        });
                    };       
                };
                viewModel.goBack = function() {
                    ko.cleanNode($('#projectResource')[0]);
                    $('#projectResource').empty();
                    channel.publish("showList", {view: 'projects'});
                };
                viewModel.removeResourceClick = function(data) {
                    var resourceName = data.firstName + ' ' + data.lastName;
                    viewModel.removeResourceText(resourceName);
                    viewModel.removeResourceID(data.id);
                };
                viewModel.removeResource = function() {
                    if(viewModel.removeResourceID()) {
                        $.ajax({
                            type: 'DELETE',
                            url: '/api/projects/' + projectId + '/resources/' + viewModel.removeResourceID(),
                            dataType: 'json',
                            success: function (data) {
                                viewModel.load();
                                $('#deleteResourceModal').modal('hide');
                            },
                            error: function() {
                                console.log('erroe');
                            }
                        });
                    }
                };
                viewModel.load();
                
            },
            createUI: function($parent) {
                $parent.append(html);
                //apply bindings
                ko.applyBindings(viewModel, $parent.get(0));
            }
        };
    }
);