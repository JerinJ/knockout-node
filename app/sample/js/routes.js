define(["sammy", "viewModel/resourceModel"], function(Sammy, resourceModel) {
    return Sammy(function() {
        console.log('in routes');
        this.get('/', function() {
            console.log('in slash');
            resourceModel.createViewModel();
            resourceModel.createUI($('#container'));
        });
    });
});