const Listing=require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    let allListing = await Listing.find();
    res.render("index.ejs", { allListing });
}

module.exports.renderNewForm=(req, res) => {
    res.render("new.ejs");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    /*now use nesting populate with review blove line*/
    let listing = await Listing.findById(id).populate({ path: "reviews",model:"Review", populate: { path: "author" } }).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("errorMsg", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("show.ejs", { listing });
    }
}
module.exports.createListing=async (req, res, next) => {
   
        let response=await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();   

 //2nd tecnique let listing1=new Listing(req.body.listing);
    //console.log(req.body.listing);
    // if(Object.keys(req.body).length<=4){
    //     next(new ExpressError(404,"Send valid data for listing"));
    // }else{

    let { title, description, url, price, location, country } = req.body;
        url=req.file.path;
    var fileName=req.file.filename;
    let listing1 = new Listing({
        title: title,
        description: description,
        image: {
            url: url,
            filename:fileName
        },
        price: price,
        location: location,
        country: country
    });
    listing1.owner = req.user._id;
    listing1.geometry=response.body.features[0].geometry;
    await listing1.save();
    req.flash("successMsg", "New Listing Created");
    res.redirect("/listings");
    // }
}

module.exports.renderEditForm=async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("errorMsg", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let orignalImageUrl=listing.image.url;
    console.log(orignalImageUrl);
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250");
    console.log(orignalImageUrl);
    res.render("editListing.ejs", { listing,orignalImageUrl });
}

module.exports.updateListing=async (req, res, next) => {
    let { id } = req.params;
    let { title, description, url, price, location, country } = req.body;
    let listing=await Listing.findOneAndUpdate({ _id: id }, {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    }, { new: true });
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("successMsg", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destoryListing=async (req, res) => {
    let { id } = req.params;
    let delet = await Listing.findByIdAndDelete(id);
    console.log(`this listing is deleted ${delet}`);
    req.flash("successMsg", "Listing Deleted");
    res.redirect("/listings");
}