module.exports = function(grunt) {
    grunt.initConfig({
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:3000/index.html'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('test', function() {
        var done = this.async();

        var app = require('./app');
        app.start(app.app, function() {
            console.log("Test instance of app listening on", app.app.get('port'));
            grunt.task.run('qunit');
            done();
        });
    });
};
