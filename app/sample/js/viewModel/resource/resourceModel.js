define(["jquery", "ko", "viewModel/resource/resourceCreateEdit", "text!../../../template/resource/resources.html"], function($, ko, resourceCreateEdit, html) {
    var viewModel = {};
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
                console.log('create resouce');
                viewModel.showForm(false);
                resourceCreateEdit.createViewModel();
                resourceCreateEdit.createUI($('#resourceCreateEdit'));
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