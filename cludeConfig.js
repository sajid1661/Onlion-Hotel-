const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

//cloudinary account ki informatin dena access karnay k liya
cloudinary.config({
    cloud_name:process.env.CLUDE_NAME,
    api_key: process.env.CLUDE_API_KEY,
    api_secret: process.env.CLUDE_API_SECRET
});
// folder create karna files store karnay k liya
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats:["png","jpg","jpeg"],
    },
  });

  module.exports={cloudinary, storage};