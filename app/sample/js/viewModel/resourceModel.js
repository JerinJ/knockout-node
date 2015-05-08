define(["jquery", "ko", "viewModel/resourceCreateEdit", "text!../../template/resources.html"], function($, ko, resourceCreateEdit, html) {
    var viewModel = {};
    return {
        createViewModel: function() {
            viewModel.showForm = ko.observable(true);
            viewModel.resources = ko.observableArray([]);
            viewModel.editResouceClick = function(data) {
                console.log(data);
                $.ajax({
                    type: 'GET',
                    url: '/api/resources/'+data.id,
                    dataType: 'json',
                    success: function (data) {
                        viewModel.showForm(false);
                        resourceCreateEdit.createViewModel(data);
                        resourceCreateEdit.createUI($('#createEdit'));
                    }
                });
            };
            viewModel.createResouceClick = function() {
                console.log('create resouce');
                viewModel.showForm(false);
                resourceCreateEdit.createViewModel();
                resourceCreateEdit.createUI($('#createEdit'));
            };
            $.ajax({
                type: 'GET',
                url: '/api/resources',
                dataType: 'json',
                success: function (data) {
                    viewModel.resources(data);
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