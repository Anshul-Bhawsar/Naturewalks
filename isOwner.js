const NatureWalks= require('./models/NatureWalks');


module.exports.
const isOwner = async (req,res,next) =>{
    const { id } =req.params;
        const walk = await NatureWalks.findById(id);
    if(!walk.owner.equals(req.user._id)){
        req.flash('error', "You Don't have Permission");
        return res.redirect(`/naturewalk/${walk._id}`)
    }
    next();
}
