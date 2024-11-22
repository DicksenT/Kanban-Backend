const mongoose = require('mongoose')
const scheme = mongoose.Schema

const validator = require('validator')

//brcypt for hashing password
const bcrypt = require('bcryptjs')

const userScheme = new scheme({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    boards:[{type:mongoose.Schema.Types.ObjectId, ref:'Board'}]
})


//we create new statics/func as like .find, .findByIdAndDelete etc
userScheme.statics.signUp = async function(email,password){

    //validation
    if(!email || !password){
        throw Error('All field must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('email is not valid')
    }
    if(!validator.isStrongPassword(password, {minLength:6, minSymbols:0,minUppercase:0})){
        throw Error('Password is not strong enough')
    }


    //check if email is exist in signup
    const exist = await this.findOne({email})
    if(exist){
        throw Error('Email already exist')
    }

    //salt: generate random string to added to password so hacker need time to crack it
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})
    return user
}

userScheme.statics.login = async function(email, password){
    if(!email || !password){
        throw Error('All field must filled')
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error('Email is not registerd')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Password is incorrect')
    }
    return user
}

module.exports = mongoose.model('User', userScheme)