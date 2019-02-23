console.log("process.env.START_APP_SERVER", process.env.START_APP_SERVER)

module.exports = {
    launch: {
        args: ['--disable-background-networking', 
        '--disable-breakpad', 
        '--disable-canvas-aa', 
        '--disable-client-side-phishing-detection', 
        '--disable-cloud-import', 
        '--disable-composited-antialiasing', 
        '--disable-default-apps', 
        '--disable-extensions-http-throttling', 
        '--disable-gpu', 
        '--disable-gpu-sandbox', 
        '--disable-kill-after-bad-ipc', 
        '--disable-namespace-sandbox', 
        '--disable-plugins', 
        '--disable-print-preview', 
        '--disable-renderer-backgrounding', 
        '--disable-seccomp-filter-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-smooth-scrolling', 
        '--disable-sync', 
        '--disable-translate', 
        '--disable-translate-new-ux', 
        '--disable-webgl', 
        '--disk-cache-dir=/tmp/cache-dir', 
        '--disk-cache-size=10000000', 
        '--ipc-connection-timeout=10000', 
        '--media-cache-size=10000000', 
        '--nacl-dangerous-no-sandbox-nonsfi', 
        '--no-default-browser-check', 
        '--no-experiments', 
        '--no-first-run', 
        '--no-pings', 
        '--no-sandbox', 
        '--no-zygote', 
        '--prerender-from-omnibox=disabled', 
        '--window-size=1280,720', 
        '--runInBand', 
        '--disable-web-security',
        '--disable-dev-profile',
        '--disable-dev-shm-usage', 
        '--remote-debugging-port=9222'], 
        dumpio: true,
        headless: process.env.HEADLESS !== 'false',
        timeout: 60000
    }
}

if (process.env.START_APP_SERVER === "true") {
    module.exports.server = {
        command: 'webpack-dev-server --mode development --port 8080',
        port: 8080,
        launchTimeout: 60000,
        debug: true
    };
}
