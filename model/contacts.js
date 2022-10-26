

// 1.Part : Requirement & MongoDB Atlas URL

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoAtlas='mongodb+srv://alper:Q1w2e3r4@myfirstclustor.r7mci.mongodb.net/MyFirstClustor?retryWrites=true&w=majority';

// 2.Part : Database Connection:

mongoose.connect(
mongoAtlas,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}
)
.then(()=>console.log('MongoDB Connected!'))
.catch(err=> console.log(err));

// 3.Part: Schema Creation:

var userSchema = new Schema({
    name: {type: String, trim: true, minlength:1},
    mail: {type: String, required: 'Without e-mail this app does not work!'},
    avatar: String,
    status: {
      type: Boolean,
      default: false
    }
}),

User = mongoose.model('contacts',userSchema );

module.exports = User;