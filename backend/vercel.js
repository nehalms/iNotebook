{
  "version": 2,
  "builds": [
    { "src": "*.js", "use": "@vercel/node" }
  ],
  "routes": [
    {
      "src": "/api/auth",
      "dest": "/api/auth"
    },
    {
      "src": "/api/notes",
      "dest": "/api/notes"
    },
  ],
}
