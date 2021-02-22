const User = require("../models/user");

const renderRegister = (req, res) => {
    res.render("users/register")
}

const register = async (req, res, next) => {
    try {
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash("success", "Welcome to Thermal Springs in Turkey");
        res.redirect("/thermals");
    })
    } catch (e){
        req.flash("error", e.message);
        res.redirect("register")
    }
}

const renderLogin = (req,res) => {
    res.render("users/login")
}

const login = (req,res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/thermals";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

const logout = (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out :)")
    res.redirect("/thermals");
}

module.exports = {
    renderRegister, 
    register, 
    renderLogin, 
    login, 
    logout
}