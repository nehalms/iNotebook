const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
    
        const userPermissions = req.user.permissions || [];
    
        if (!userPermissions.includes(requiredPermission)) {
          return res.status(403).json({
            error: `Access denied: Missing '${requiredPermission}' permission`,
          });
        }
      
        next();
      } catch(err) {
        console.log('Error**', err);
        res.status(401).send({error: 'Error in validating permissions'});
      }
    };
};

module.exports = checkPermission;