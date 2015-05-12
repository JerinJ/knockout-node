
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , api = require('./routes/api')
    , http = require('http')
    , path = require('path')
    , mongo = require('mongodb')
    , monk = require('monk')
    , db = monk('localhost:27017/knockout-node')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/app/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.Router());
app.use(express.static(path.join(__dirname, 'app')));

// TODO: Add error handling
//app.use(errorHandler);




// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/', routes.index);

app.get ('/api/projects',           api.projects);
app.post('/api/projects',           api.createProject);
app.get ('/api/projects/:id',       api.getProject);
app.put ('/api/projects/:id',       api.updateProject);
app.delete('/api/projects/:id',     api.deleteProject);

app.get ('/api/resources',      api.resources);
app.post('/api/resources',      api.createResource);
app.get ('/api/resources/:rid', api.getResource);
app.put ('/api/resources/:rid', api.updateResource);
app.delete('/api/resources/:rid', api.deleteResource);


app.get ('/api/projects/:pid/resources',      api.projectResources);
app.post('/api/projects/:pid/resources',      api.createProjectResource);
app.delete('/api/projects/:pid/resources/:eid',      api.deleteProjectResource);
app.get ('/api/projects/:pid/getNotProjectResources',    api.getNotProjectResources);

app.get ('/api/projects/:pid/backlogs',      api.backlogs);
app.post('/api/projects/:pid/backlogs',      api.createBacklog);
app.get ('/api/projects/:pid/backlogs/:bid', api.getBacklog);
app.put ('/api/projects/:pid/backlogs/:bid', api.updateBacklog);
// Missing delete call for backlogs services.
// Missing backlogs search for particular resource.

app.get ('/api/projects/:pid/backlogs/:bid/tasks',      api.tasks);
app.post('/api/projects/:pid/backlogs/:bid/tasks',      api.createTask);// pid is not used in api
app.get ('/api/projects/:pid/backlogs/:bid/tasks/:tid', api.getTask);
app.put ('/api/projects/:pid/backlogs/:bid/tasks/:tid', api.updateTask);
// Missing delete call for tasks services.
// Missing task with resource and project services.
// Task should be for project not for backlogs(as per my understanding backlogs are those project which has crossed the estimated time)

app.get   ('/api/projects/:pid/backlogs/:bid/tasks/:tid/entries',       api.timeEntries);
app.post  ('/api/projects/:pid/backlogs/:bid/tasks/:tid/entries',       api.createTimeEntry);// pid is not used in api
app.get   ('/api/projects/:pid/backlogs/:bid/tasks/:tid/entries/:teid', api.getTimeEntry);
app.put   ('/api/projects/:pid/backlogs/:bid/tasks/:tid/entries/:teid', api.updateTimeEntry);
app.delete('/api/projects/:pid/backlogs/:bid/tasks/:tid/entries/:teid', api.deleteTimeEntry);
// Missing task with resource and project services.
// Missing timeEntries should be there both for backlog and projects services.
// Time should be sent as unix-timestamp which can be converted latter on

// when localhost is executed, there exist a doc which matches the Service-URI and short discription; Indeed helpful
// understanding data in querystrings. But there should be some doc which provides the information
// regarding payload data that is passed with HTTP request body.

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
