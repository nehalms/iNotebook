{
  "version": 2,
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
   "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)" 
      "destination": "/api" 
    }
  ]
}
