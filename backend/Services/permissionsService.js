const User = require("../models/User");

const PERMISSIONS = {
    1: 'notes',
    2: 'tasks',
    3: 'images',
    4: 'games',
    5: 'messages',
    6: 'news',
    7: 'calendar',
}

const getUsers = async (req) => {
    return await new Promise( async (resolve, reject) => {
        // Get current admin user to check if they are root admin
        const adminUser = await User.findById(req.user.id).select('email').lean();
        const rootAdminEmail = process.env.ADMIN_EMAIL || 'inotebook002@gmail.com';
        
        // If current admin is not root admin, filter out root admin from results
        let users;
        if(adminUser && adminUser.email !== rootAdminEmail) {
            users = await User.find({ email: { $ne: rootAdminEmail } });
        } else {
            // Root admin can see all users
            users = await User.find();
        }
        
        let parsedUsers = []
        await Promise.all(
            users.map(async (user, i) => {
                let User = {
                    id: i + 1,
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    notes: user.permissions.includes(PERMISSIONS[1]), 
                    tasks: user.permissions.includes(PERMISSIONS[2]), 
                    images: user.permissions.includes(PERMISSIONS[3]), 
                    games: user.permissions.includes(PERMISSIONS[4]),
                    messages: user.permissions.includes(PERMISSIONS[5]),
                    news: user.permissions.includes(PERMISSIONS[6]),
                    calendar: user.permissions.includes(PERMISSIONS[7]),
                }
                parsedUsers.push(User);
            })
        );
        resolve({status: 1, users: parsedUsers});
    })
}

const setAllPermissions = async (req) => { 
    return await new Promise( async (resolve, reject) => {
        let userId = req.params.id;
        if(!userId) {
            reject({error: 'Please pass the User Id'});
        }
        let user = await User.findById(userId);
        if(!user) {
            reject({error: 'User not found'})
        }
        let tempPermissions = user.permissions;
        Object.entries(PERMISSIONS).map(entry => {
            tempPermissions.push(entry[1]);
        });
        user = await User.findByIdAndUpdate(userId, {permissions: tempPermissions}, {new: true});
        resolve({status: 1, msg: 'Permissions set successfully', user: user});
    })
}

const resetAllPermissions = async (req) => { 
    return await new Promise( async (resolve, reject) => {
        let userId = req.params.id;
        if(!userId) {
            reject({error: 'Please pass the User Id'});
        }
        let user = await User.findById(userId);
        if(!user) {
            reject({error: 'User not found'})
        }
        user = await User.findByIdAndUpdate(userId, {permissions: []}, {new: true});
        resolve({status: 1, msg: 'Permissions reset successfully', user: user});
    })
}

const setPermissions = async (req) => { 
    return await new Promise( async (resolve, reject) => {
        let idx = req.params.idx;
        let userId = req.params.id;
        let user = await User.findById(userId);
        if(!user) {
            reject({error: 'User not found'})
        }
        if(user.permissions.includes(PERMISSIONS[idx])) {
            reject({error: 'Permission already exsists'});
        } else {
            let perm = user.permissions;
            perm.push(PERMISSIONS[idx]);
            user = await User.findByIdAndUpdate(userId, {permissions: perm}, {new: true});
            resolve({status: 1, msg: 'Permission set successfully', user: user});
        }
    })
}

const resetPermissions = async (req) => { 
    return await new Promise( async (resolve, reject) => {
        let idx = req.params.idx;
        let userId = req.params.id;
        let user = await User.findById(userId);
        if(!user) {
            reject({error: 'User not found'})
        }
        let perm = PERMISSIONS[idx];
        if(!user.permissions.includes(perm)) {
            reject({error: 'Permission does not exsists'});
        } else {
            let permissions = user.permissions;
            permissions = permissions.filter((item) => { 
                return (item.toString().toLowerCase() != perm.toLowerCase())
            });
            user = await User.findByIdAndUpdate(userId, {permissions: permissions}, {new: true});
            resolve({status: 1, msg: 'Permission reset successfully', user: user});
        }
    })
}

module.exports = {
    getUsers,
    setAllPermissions,
    resetAllPermissions,
    setPermissions,
    resetPermissions,
}