module.exports = {

    // Task options
    options: {
        limit: 3
    },

    // Tasks
    distFirst: [
        'clean',
        'jshint'
    ],
    distSecond: [
        'cssmin',
        'uglify'
    ]
};