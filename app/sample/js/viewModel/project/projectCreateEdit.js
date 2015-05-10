define(["jquery",
        "ko",
        "postal",
        "text!../../../template/project/projectCreateEdit.html"
    ], function($, ko, postal, html) {
        var viewModel = {};
        var channel = postal.channel();
        return {
            createViewModel: function(detail) {
                viewModel.formVisble = ko.observable(true);
                viewModel.name = ko.observable();
                viewModel.description = ko.observable();
                viewModel.id = ko.observable();

                if(detail) {
                    if(detail.id) {
                        viewModel.id(detail.id);
                    }
                    if(detail.description) {
                        viewModel.description(detail.description);
                    }
                    if(detail.name) {
                        viewModel.name(detail.name);
                    }
                }
                viewModel.cancel = function() {
                    ko.cleanNode($('#projectCreateEdit')[0]);
                    $('#projectCreateEdit').empty();
                    channel.publish("showList", {view: 'projects'});
                };
                viewModel.url = '../api/projects';
                viewModel.type = 'POST';
                if(viewModel.id() !== undefined) {
                    viewModel.url = '../api/projects/'+viewModel.id();
                    viewModel.type = 'PUT';
                }
                viewModel.saveProject = function() {
                    var data = {
                        name: viewModel.name(),
                        description: viewModel.description()
                    };
                    $.ajax({
                        url: viewModel.url,
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        dataType: 'json',
                        type: viewModel.type,
                        success: function(data) {
                            viewModel.formVisble(false);
                            ko.cleanNode($('#projectCreateEdit')[0]);
                            $('#projectCreateEdit').empty();
                            channel.publish("showList", {view: 'projects'});
                        },
                        error: function(data) {
                            console.log(data);
                        }
                    })
                };
            },
            createUI: function($parent) {
                console.log('in create resource');
                $parent.append(html);
                //apply bindings
                ko.applyBindings(viewModel, $parent.get(0));
            }
        };
    }
);