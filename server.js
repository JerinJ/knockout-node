
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'app')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get ('/api/projects',     api.projects);
app.post('/api/projects',     api.createProject);
app.get ('/api/projects/:id', api.getProject);
app.put ('/api/projects/:id', api.updateProject);
// Missing delete call for project services.

app.get ('/api/resources',      api.resources);
app.post('/api/resources',      api.createResource);
app.get ('/api/resources/:rid', api.getResource);
app.put ('/api/resources/:rid', api.updateResource);
// Missing delete call for resources services.

app.get ('/api/projects/:pid/resources',      api.projectResources);
app.post('/api/projects/:pid/resources',      api.createProjectResource);
app.get ('/api/projects/:pid/resources/:id', api.getProjectResource);
// Missing delete call for project and resources services.

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
