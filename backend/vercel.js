{
  "version": 2,
  "builds": [{
    "src": "./index.js",
    "use": "@now/node-server"
  }],
  "routes": [
    {
      "src": "/.*",
      "dest": "server.js"
    }
  ]
}
