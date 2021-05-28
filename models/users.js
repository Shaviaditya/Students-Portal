const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'Please Enter a valid Username'],
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true,'Please Enter a valid Password'],
        unique: true,
        minlength : [6,'Password Length too short!']
    },
    stream:{
        type: String,
    },
    year:{
        type: Number,
    }
});
//Pre Fx before creating new user
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})
//static for logging in
userSchema.statics.login = async function(username,password){
    const user = await this.findOne({username});
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect Details')
}
//Next after creating new user
userSchema.post('save',(doc,next)=>{
    console.log('The new user created is : ',doc);
    next();
})
const User = mongoose.model('user',userSchema);

module.exports = User;