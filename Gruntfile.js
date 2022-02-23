
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            dist: "dist/**"
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ["src/fonts/*"],
                        dest: "dist/fonts",
                        filter: "isFile"
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: "'/*! <%= pkg.name %> - v<%= pkg.version %> */'",
                compatibility: "ie8",
                report: "gzip",
                level: {
                    1: {
                        all: true
                    },
                    2: {
                        all: true
                    }
                }
            },
            dist: {
                expand: true,
                cwd: "dist",
                src: ["css/*.css"],
                dest: "dist"
            }
        },
        less: {
            dist : {
                options: {
                    compress: true,
                    modifyVars: {
                        cdnPath: "'<%= pkg.cdn %>@<%= pkg.version %>'",
                        version: "'<%= pkg.version %>'"
                    },
                    paths: ["dist/css"]
                },
                files: {
                    "dist/css/<%= pkg.name %>.css": "src/less/index.less"
                }
            }
        },
        "string-replace": {
            dist: {
                files: [{
                    expand: true,
                    cwd: "dist/",
                    src: "js/*",
                    dest: "dist/"
                }],
                options: {
                    replacements: [{
                        pattern: /\{\{(version)\}\}/igm,
                        replacement: "<%= pkg.version %>"
                    }, {
                        pattern: /\{\{(package)\}\}/igm,
                        replacement: "<%= pkg.name %>"
                    }, {
                        pattern: /\{\{(url)\}\}/igm,
                        replacement: "<%= pkg.cdn %>"
                    }]
                }
            }
        },
        uglify: {
            options: {
                banner:
                    "/*! <%= pkg.name %> - v<%= pkg.version %> */",
                report: "gzip",
                compress: true,
                exportAll: true,
            },
            main: {
                files: [
                    {
                        "dist/js/<%= pkg.name %>.js": ["src/js/index.js"]
                    },
                ],
            }
        },
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("default", ["clean", "copy", "less", "cssmin", "uglify", "string-replace"]);
};