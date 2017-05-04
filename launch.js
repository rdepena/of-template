const liveServer = require('live-server');
const openfinConfigBuilder = require('openfin-config-builder');
const openfinLauncher = require('openfin-launcher');
const path = require('path');
const readline = require('readline');

const configPath = path.resolve('public/app.json');
const openfinVersion = 'alpha';
let target;
const serverParams = {
    root: path.resolve('public'),
    open: false,
    logLevel: 2
};

//Update our config and launch openfin.
function launchOpenFin() {
    openfinConfigBuilder.update({
        startup_app: {
            url: target + '/index.html',
            applicationIcon: target + '/favicon.ico',
            saveWindowState: true
        },
        runtime: {
            arguments: `--js-flags=--expose_gc --enable-precise-memory-info`,
            version: openfinVersion
        },
        shortcut: {
            icon: target + '/favicon.ico'
        }
    }, configPath)
        .then(openfinLauncher.launchOpenFin({ configPath: configPath }))
        .catch(err => console.log(err));
}


//Start the server server and initially launch
liveServer.start(serverParams).on('listening', () => {
    const { address, port } = liveServer.server.address();
    target = `http://localhost:${ port }`;
    launchOpenFin();
});

//then on any keypress re-launch
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.ctrl && key.name === 'l') {
        console.log('launching OpenFin');
        launchOpenFin();
    }
});

console.log('re-launch OpenFin by ctrl+l');
console.log('exit by pressing ctr+c');
