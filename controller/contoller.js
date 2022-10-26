const multer = require('multer'); // used for uploading files
const path = require('path');
const jimp = require('jimp'); // JavaScript Image Manipulation Program
const nodemailer = require('nodemailer');
const contacts = require('../model/contacts');


let contactList = []; // new contact list in below list

let fileName = null; // filename for choose file input ""

// ! SET STORAGE ENGINE FOR AVATAR: =================================================================

// set storage engine for avatar
// The disk storage engine gives you full control on storing files to disk.
const storager = multer.diskStorage({
    destination: 'public/uploads/avatars',
    filename: (req, file, cb) => { 
        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        fileName = 'av.' + 
                    Date.now() + 
                    path.extname(file.originalname);
                    cb(null, fileName);
    }
});

//init upload for avatar. Create a multer object
const upload = multer({
    storage: storager
}).single('avatar'); 
// .single(fieldname) : Accept a single file with the name fieldname. The single file will be stored in req.file.

// ! SET STORAGE ENGINE FOR EMAIL: =================================================================

//set storage engine for email
const attachStorager = multer.diskStorage({
    destination: 'public/uploads/attachments',
    filename: (req, file, cb) => {
        fileName = 'at.' + 
                    Date.now() + 
                    path.extname(file.originalname);
                    cb(null, fileName);
    }
});

//init upload for email
const attachUpload = multer({
    storage: attachStorager
}).single('attach');

// ! HOME PAGE: =================================================================
exports.homeRoute = (req,res) => {
    
    contacts.find({},(err, result)=>{ 

         if (err) {
            console.log(err);       
        } else {
            res.render('index',{contactData: result}); 
        } 
    });
    
}

// ! NEW CONTACT: =================================================================
exports.newContact = (req,res) => {
    upload(req, res, () => {

              //check if there is a photo
              if (fileName == null) {
                fileName = 'av.default.png';
            } else {
                //On here we will process the image resizing
                jimp.read('public/uploads/avatars/' + fileName, (err, file) => {
                    if(err) throw err;
                    file
                        .resize(250,250) //resize
                        .quality(60) // set the quality of image
                        .write('public/uploads/avatars/' + fileName); //save
                });
            }

        let newContact = {
            name: req.body.name,
            mail: req.body.email,
            avatar: fileName
        }
        //mongo goes here...
        contacts.create(newContact,(err,contacts)=>{
            if(err) concole.log(err);
            else console.log(`Congrads! Your new contact inserted:${JSON.stringify(newContact)}`);
        });

        contactList.push(newContact);
        console.log(contactList);

        //On here we will process the image resizing
        jimp.read('public/uploads/avatars/' + fileName, (err, file) => {
            if(err) throw err;
            file
                .resize(250,250) //resize
                .quality(60) // set the quality of image
                .write('public/uploads/avatars/' + fileName); //save
        });
        res.redirect('/');
    });

}

// ! DELETE CONTACT: =================================================================

 //This function gets the ID and delete contact from contactList array
exports.deleteContact = (req,res) => {
    let { id } = req.params;

    console.log(id);

    if(id){
        contacts.deleteOne({_id:id}, function(err, tasks){
          if(err) throw err;
          res.redirect('/');
        });
      }else{
        res.send('Please enter Id');
        res.end();
      }

  /*   contactList.splice(id,1);
    res.redirect('/'); */

}

// ! SEND EMAIL: =================================================================

exports.sendMail = (req, res) => {
    attachUpload(req, res, ()=>{
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: req.body.user, // generated ethereal user
            pass: req.body.pass // generated ethereal password
           /*  user: 'alper.ece@digitalcareerinstitute.org',
            pass: 'Rba@20203' */
            }
        });

        // send mail with defined transport object
        let info =  {
            from: '"FBW10 Contact List Project 👻" <alper.ece@digitalcareerinstitute.org>', // sender address
            to: req.body.to, // list of receivers
            cc: req.body.cc,
            subject: req.body.subject, // Subject line
            html: "<b>"+req.body.message+"</b>", // html body
            attachments: [{
                filename:fileName,
                path: 'public/uploads/attachments/' + fileName
            }]
        };

        transporter.sendMail(info, (err,info)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Message sent to : ' + info.messageId);
            }
        });

        fileName = null; 
        res.redirect('/');

        
    });
}

// ! CHANGE BUTTON COLOR: =================================================================
/* 
exports.turnBtn = (request,response)=>{
    let { id } = request.params;
    Task.findById(id,function(err,task){
      task.status = !task.status;
      task.save();
      response.redirect('/');
    })
  }; */

// ! UPDATE - GET: =================================================================


exports.updateContact = (req,res) => {
    upload(req, res, () => {
     

        console.log(req.body)
        
        //mongo goes here...
        let updatedContact = {
            
        }
        if (req.body.name != '' ){
            updatedContact.name = req.body.name;
        }

        if (req.body.email != '' ){
            updatedContact.mail = req.body.email;
        }

        if (fileName != null){
            updatedContact.avatar = fileName;
            console.log(fileName);
            //On here we will process the image resizing
            jimp.read('public/uploads/avatars/' + fileName, (err, file) => {
                if(err) throw err;
                file
                    .resize(250,250) //resize
                    .quality(60) // set the quality of image
                    .write('public/uploads/avatars/' + fileName); //save
            });
        }

        if (updatedContact != {}) {
            
            contacts.updateOne({_id:req.body.id},{$set:updatedContact},
                (err,result)=>{
                    if(err) console.log(err);
                    else console.log(result);
            });
            fileName = null;
        }
        res.redirect('/');
    });
}