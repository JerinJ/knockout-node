var fs = require('fs');
var _ = require('lodash');
var $ = require('jquery');

var projects;
fs.readFile('data/projects.json', 'utf8', function (err, data) {
    projects = JSON.parse(data);
});

var resources;
fs.readFile('data/resources.json', 'utf8', function (err, data) {
    resources = JSON.parse(data);
});

var backlogs;
fs.readFile('data/backlogs.json', 'utf8', function (err, data) {
    backlogs = JSON.parse(data);
});

var tasks;
fs.readFile('data/tasks.json', 'utf8', function (err, data) {
    tasks = JSON.parse(data);
});

var projectResources;
fs.readFile('data/projectResources.json', 'utf8', function (err, data) {
    projectResources = JSON.parse(data);
});

var projectBacklogs;
fs.readFile('data/projectBacklogs.json', 'utf8', function (err, data) {
    projectBacklogs = JSON.parse(data);
});

var backlogTasks;
fs.readFile('data/backlogTasks.json', 'utf8', function (err, data) {
    backlogTasks = JSON.parse(data);
});

var timeEntries;
fs.readFile('data/timeEntries.json', 'utf8', function (err, data) {
    timeEntries = JSON.parse(data);
});

//////////////////////////////////////////////////////////////////////////
//////////////////////// tasks ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
exports.timeEntries = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);
    var tid = parseInt(req.params.tid);

    var pbs = _.filter(projectBacklogs, {'pid': pid, 'bid': bid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        if (bks.length > 0) {
            var tes = _.filter(timeEntries, function(te) {
                return _.findIndex(bks, {tid: te.tid}) + 1;
            });
            res.json(tes);
        }
        else {
            res.json({'error': 'Backlog / Task Id not found'});
        }
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

exports.getTimeEntry = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);
    var tid = parseInt(req.params.tid);
    var teid = parseInt(req.params.teid);

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        var tes = _.filter(timeEntries, function(te) {
            return _.findIndex(bks, {tid: te.tid}) + 1;
        });

        var resource = _.filter(tes, {'id': teid});
        if (resource.length > 0) {
            res.json(resource[0]);
        }
        else {
            res.json({'error': 'Id not found'});
        }
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

exports.createTimeEntry = function(req, res){
    var tid = parseInt(req.params.bid);
    var teid = parseInt(timeEntries[timeEntries.length - 1].id) + 1;

    var resource = {
        id: teid,
        tid: tid,
        timestamp: req.body.timestamp,
        timeSpent: parseFloat(req.body.timeSpent),
        timeRemaining: parseFloat(req.body.timeRemaining),
        comments: req.body.comments
    };
    timeEntries.push(resource);
    fs.writeFile('data/timeEntries.json', JSON.stringify(timeEntries), 'utf8', function (err) {
        if (err) throw err;
    });

    res.json({success: true});
};

exports.updateTimeEntry = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);
    var tid = parseInt(req.params.tid);
    var teid = parseInt(req.params.tid);

    var data = req.body;
    data.id = teid;
    delete data.pid;
    delete data.bid;
    delete data.tid;
    delete data.teid;

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        var tes = _.filter(timeEntries, function(te) {
            return _.findIndex(bks, {tid: te.tid}) + 1;
        });

        var resource = _.filter(tes, {'id': teid});
        if (resource.length > 0) {
            _.extend(resource[0], data);
            res.json(resource[0]);
        }
        else {
            res.json({'error': 'Id not found'});
        }
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

exports.deleteTimeEntry = function(req, res){
    var tid = parseInt(req.params.tid);
    var teid = parseInt(req.params.tid);

    _.remove(timeEntries, function(te) { return (te.id === teid && te.tid === tid); });
    fs.writeFile('data/timeEntries.json', JSON.stringify(timeEntries), 'utf8', function (err) {
        if (err) throw err;
    });
    res.json({success: true});
};

//////////////////////////////////////////////////////////////////////////
//////////////////////// tasks ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
exports.tasks = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);

    var pbs = _.filter(projectBacklogs, {'pid': pid, 'bid': bid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        var tks = _.filter(tasks, function(tk) {
            return _.findIndex(bks, {tid: tk.id}) + 1;
        });
        res.json(tks);
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

exports.getTask = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);
    var tid = parseInt(req.params.tid);

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        var tks = _.filter(tasks, function(tk) {
            return _.findIndex(bks, {tid: tk.id}) + 1;
        });

        var resource = _.filter(tks, {'id': tid});
        if (resource.length > 0) {
            res.json(resource[0]);
        }
        else {
            res.json({'error': 'Id not found'});
        }
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

exports.createTask = function(req, res){
    var bid = parseInt(req.params.bid);
    var tid = parseInt(tasks[tasks.length - 1].id) + 1;

    var resource = {
        id: tid,
        name: req.body.name,
        description:req.body.description,
        createdttm:req.body.createdttm,
        estimatedTime: parseFloat(req.body.estimatedTime),
        status: req.body.status,
        assignedTo: req.body.assignedTo
    };
    tasks.push(resource);
    fs.writeFile('data/tasks.json', JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
    });
    backlogTasks.push({tid:tid, bid: bid});
    fs.writeFile('data/backlogTasks.json', JSON.stringify(backlogTasks), 'utf8', function (err) {
        if (err) throw err;
    });

    res.json({success: true});
};

exports.updateTask = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);
    var tid = parseInt(req.params.tid);

    var data = req.body;
    data.id = tid;
    delete data.pid;
    delete data.bid;
    delete data.tid;

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    if (pbs.length > 0) {
        var bks = _.filter(backlogTasks, {'bid': bid});
        var tks = _.filter(tasks, function(tk) {
            return _.findIndex(bks, {tid: tk.id}) + 1;
        });

        var resource = _.filter(tks, {'id': tid});
        if (resource.length > 0) {
            _.extend(resource[0], data);
            fs.writeFile('data/tasks.json', JSON.stringify(tasks), 'utf8', function (err) {
                if (err) throw err;
            });
            res.json(resource[0]);
        }
        else {
            res.json({'error': 'Id not found'});
        }
    }
    else {
        res.json({'error': 'Project / Backlog Id not found'});
    }
};

//////////////////////////////////////////////////////////////////////////
//////////////////////// project resource ////////////////////////////////
//////////////////////////////////////////////////////////////////////////
exports.projectResources = function(req, res){
    var pid = parseInt(req.params.pid);
    var db = req.db;
    var projectRescollection = db.get('projectResource');
    var resourceCollection = db.get('resourceCollection');
    var resourceDetail = [];
    projectRescollection.find({'pid': pid},{},function(e, projectResources){
        if(projectResources.length > 0) {
            _.each(projectResources, function(projectResource, index) {
                resourceCollection.find({'id': projectResource.eid}, {}, function(e, resource) {
                    resourceDetail.push(resource[0]);
                    if(index === projectResources.length-1) {
                        res.json(resourceDetail);
                    }
                });
            });
        } else {
            res.json(resourceDetail);
        }
    });
};

exports.getNotProjectResources = function(req, res){
    var pid = parseInt(req.params.pid);
    var db = req.db;
    var projectRescollection = db.get('projectResource');
    var resourceCollection = db.get('resourceCollection');
    var resourceId = [];
    var resourceDetail = [];
    projectRescollection.find({'pid': pid},{},function(e,projectResources){
        if(projectResources.length > 0) {
            _.each(projectResources, function(projectResource, index) {
                resourceId.push(projectResource.eid);
                if(index === projectResources.length-1) {
                    resourceCollection.find({}, {}, function(e, resources) {
                        _.each(resources, function(resource, index) {
                            if(!(_.contains(resourceId, resource.id))) {
                                resourceDetail.push(resource);
                            }
                            if(index === resources.length-1) {
                                res.json(resourceDetail);
                            }
                        });
                    });
                }
            });
        } else {
            var collection = db.get('resourceCollection');
            collection.find({},{},function(e,docs){
                res.json(docs);
            });
        }
    });
};

exports.createProjectResource = function(req, res){
    var pid = parseInt(req.params.pid);
    var eid = parseInt(req.body.eid);
    var db = req.db;
    var collection = db.get('projectResource');
    var projectResource = {
        pid: pid,
        eid: eid
    };
    collection.insert(projectResource, function(err, result){
        res.send(
            (err === null) ? { success: true } : { error: err }
        );
    });
//    collection.save();
};

exports.deleteProjectResource = function(req, res) {
    var pid = parseInt(req.params.pid);
    var eid = parseInt(req.params.eid);
    var db = req.db;
    var collection = db.get('projectResource');
    collection.remove({pid: pid, eid: eid}, function(error) {
        // we have deleted the user
        res.send(
            (error === null) ? { success: true } : { error: error }
        );
    });
//    collection.save();
};

///////////////////////////////////////////////////////////////////
//////////////////// projects /////////////////////////////////////
///////////////////////////////////////////////////////////////////

exports.projects = function(req, res){
    var db = req.db;
    var collection = db.get('projectCollection');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
};

exports.getProject = function(req, res){
    var id = parseInt(req.params.id);
    var db = req.db;
    var collection = db.get('projectCollection');
    collection.find({'id': id},{},function(e,docs){
        res.json(docs[0]);
    });
};

exports.createProject = function(req, res){
    var db = req.db;
    var collection = db.get('projectCollection');
    collection.find({},{},function(e,docs){
        var id = docs[docs.length - 1].id + 1;
        var project = {
            id: id,
            name: req.body.name,
            description:req.body.description
        };
        collection.insert(project, function(err, result){
            res.send(
                (err === null) ? { success: true } : { error: err }
            );
        });
    });
};

exports.updateProject = function(req, res){
    var id = parseInt(req.params.id);
    var db = req.db;
    var collection = db.get('projectCollection');
    collection.update(
        {
            id: id
        },
        {
            $set:{
                name: req.body.name,
                description: req.body.description
            }
        },
        function(error, result) {
            res.send(
                (error === null) ? { success: true } : { error: error }
            );
        }
    );
};

exports.deleteProject = function(req, res) {
    var id = parseInt(req.params.id);
    var db = req.db;
    var collection = db.get('projectCollection');
    collection.remove({ id: id }, function(error) {
        // we have deleted the user
        res.send(
            (error === null) ? { success: true } : { error: error }
        );
    });
};

//////////////////////////////////////////////////////////////////////////
//////////////////////// resources ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
exports.resources = function(req, res){
    var db = req.db;
    var collection = db.get('resourceCollection');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
};

exports.getResource = function(req, res){
    var id = parseInt(req.params.rid);
    var db = req.db;
    var collection = db.get('resourceCollection');
    collection.find({'id': id},{},function(e,docs){
        res.json(docs[0]);
    });
};

exports.createResource = function(req, res){
    var db = req.db;
    var collection = db.get('resourceCollection');
    collection.find({},{},function(e,docs){
        var id = docs[docs.length - 1].id + 1;
        var resource = {
            id: id,
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            email: req.body.email
        };
        collection.insert(resource, function(err, result){
            res.send(
                (err === null) ? { success: true } : { error: err }
            );
        });
    });
};

exports.updateResource = function(req, res){
    var id = parseInt(req.params.rid);
    var db = req.db;
    var collection = db.get('resourceCollection');
    collection.update(
        {
            id: id
        },
        {
            $set:{
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                email: req.body.email
            }
        },
        function(error, result) {
            res.send(
                (error === null) ? { success: true } : { error: error }
            );
        }
    );
};

exports.deleteResource = function(req, res) {
    var id = parseInt(req.params.rid);

    var db = req.db;
    var projectResourceCollection = db.get('projectResource');
    var resourceCollection = db.get('resourceCollection');
    projectResourceCollection.remove({ eid: id }, function(error) {
        if(error) throw error;

        resourceCollection.remove({ id: id }, function(error) {
            if(error) throw error;

            // we have deleted the user
            res.send(
                (error === null) ? { success: true } : { error: error }
            );
        });
    });
};

//////////////////////////////////////////////////////////////////////////
//////////////////////// backlogs ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
exports.backlogs = function(req, res){
    var pid = parseInt(req.params.pid);

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    var bks = _.filter(backlogs, function(bk) {
        return _.findIndex(pbs, {bid: bk.id}) + 1;
    });
    res.json(bks);
};

exports.getBacklog = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    var bks = _.filter(backlogs, function(bk) {
        return _.findIndex(pbs, {bid: bk.id}) + 1;
    });

    var resource = _.filter(bks, {'id': bid});

    if (resource.length > 0) {
        res.json(resource[0]);
    }
    else {
        res.json({'error': 'Id not found'});
    }
};

exports.createBacklog = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(backlogs[backlogs.length -1].id) + 1;

    var resource = {
        id: bid,
        name: req.body.name,
        description:req.body.description,
        createdttm:req.body.createdttm
    };

    backlogs.push(resource);
    fs.writeFile('data/backlogs.json', JSON.stringify(backlogs), 'utf8', function (err) {
        if (err) throw err;
    });

    projectBacklogs.push({pid:pid, bid: bid});
    fs.writeFile('data/projectBacklogs.json', JSON.stringify(projectBacklogs), 'utf8', function (err) {
        if (err) throw err;
    });

    res.json({success: true});
};

exports.updateBacklog = function(req, res){
    var pid = parseInt(req.params.pid);
    var bid = parseInt(req.params.bid);

    var data = req.body;
    data.id = bid;
    delete data.pid;
    delete data.bid;

    var pbs = _.filter(projectBacklogs, {'pid': pid});
    var bks = _.filter(backlogs, function(bk) {
        return _.findIndex(pbs, {bid: bk.id}) + 1;
    });
    var resource = _.filter(bks, {'id': bid});
    if (resource.length > 0) {
        _.extend(resource[0], data);
        fs.writeFile('data/backlogs.json', JSON.stringify(backlogs), 'utf8', function (err) {
            if (err) throw err;
        });

        res.json({success: true});
    }
    else {
        res.json({'error': 'Id not found'});
    }
};
