#!/usr/bin/env node

var url = require('url');
var spawn = require('child_process').spawn;

var redisURL = process.argv[2] || process.env.REDIS_URL;
if (!redisURL) {
  console.log('usage: redis-clurl <url> [args...]');
  process.exit();
}
var parsed = url.parse(redisURL);

if (parsed.protocol != 'redis:') {
  console.log('error: not a redis URL');
  process.exit(1);
}

var cmd = [ 'redis-cli' ];

if (parsed.hostname)
  cmd.push('-h', parsed.hostname);

if (parsed.port)
  cmd.push('-p', parsed.port);

if (parsed.auth && parsed.auth.indexOf(':') != -1)
  cmd.push('-a', parsed.auth.split(':')[1]);

if (parsed.pathname && parsed.pathname.length > 1)
  cmd.push('-n', parsed.pathname.slice(1));

cmd = cmd.concat(process.argv.slice(3));

console.log(cmd.join(' '));

var redisCLI = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' });
redisCLI.on('exit', function(code, signal) {
  process.exit(code);
});
