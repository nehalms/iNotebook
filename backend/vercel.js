{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)", 
      "destination": "index.js" 
    }
  ]
}
