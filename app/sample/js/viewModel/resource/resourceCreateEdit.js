define(["jquery",
        "ko",
        "postal",
        "text!../../../template/resource/resourceCreateEdit.html"], function($, ko, postal, html) {
    var viewModel = {};
    var channel = postal.channel();
    return {
        createViewModel: function(detail) {
            viewModel.formVisble = ko.observable(true);
            viewModel.firstName = ko.observable();
            viewModel.lastName = ko.observable();
            viewModel.email = ko.observable();
            viewModel.id = ko.observable();

            if(detail) {
                if(detail.id) {
                    viewModel.id(detail.id);
                }
                if(detail.firstName) {
                    viewModel.firstName(detail.firstName);
                }
                if(detail.lastName) {
                    viewModel.lastName(detail.lastName);
                }
                if(detail.email) {
                    viewModel.email(detail.email);
                }
            }
            viewModel.cancel = function() {
                ko.cleanNode($('#resourceCreateEdit')[0]);
                $('#resourceCreateEdit').empty();
                channel.publish("showList");
            };
            viewModel.url = '../api/resources';
            viewModel.type = 'POST';
            if(viewModel.id() !== undefined) {
                viewModel.url = '../api/resources/'+viewModel.id();
                viewModel.type = 'PUT';
            }
            viewModel.saveResource = function() {
//                viewModel.formVisble(false);
                var data = {
                    firstName: viewModel.firstName(),
                    lastName: viewModel.lastName(),
                    email: viewModel.email()
                };
                $.ajax({
                    url: viewModel.url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: 'json',
                    type: viewModel.type,
                    success: function(data) {
                        ko.cleanNode($('#resourceCreateEdit')[0]);
                        $('#resourceCreateEdit').empty();
                        channel.publish("showList");
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
});