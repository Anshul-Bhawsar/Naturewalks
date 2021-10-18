const{ naturewalkSchema , reviewSchema } = require('./schema');
const ExpressError = require('./utilities/ExpressError');
const NatureWalks= require('./models/NatureWalks');
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) =>{
        req.session.returnTo = req.originalUrl;
        if (!req.isAuthenticated()) {
        req.flash('error', 'You Need to Login')
        return res.redirect('/user/login');
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    const { id } =req.params;
        const walk = await NatureWalks.findById(id);
    if(!walk.owner.equals(req.user._id)){
        req.flash('error', "You Don't have Permission");
        return res.redirect(`/naturewalk/${walk._id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    const { walkId,  reviewId } =req.params;
        const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You Don't have Permission");
        return res.redirect(`/naturewalk/${walkId}`)
    }
    next();
}


module.exports.validateNaturewalk = (req,res,next) =>{
    const { error } = naturewalkSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    }else{
        next();
    }
}
