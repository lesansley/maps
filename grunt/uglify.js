module.exports = {
    all: {
        files: [{
            expand: true,
            cwd: 'src/scripts',
            src: ['**/*.js', '!*.min.css'],
            dest: 'dist/scripts',
            ext: '.min.js'
        }]
    }
};