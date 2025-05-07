const admin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.admin == true) {
        return next()
    }

    req.flash('error_msg', 'You need to be an admin.')
    res.redirect('/')
}


export default admin