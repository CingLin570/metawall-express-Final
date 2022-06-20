const mongoose = require('mongoose')

const verificationMailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID 未填寫'],
    },
    verification: {
      type: String,
      required: [true, 'verification必須有值'],
    },
  },
  { versionKey: false }
)

const Verification = mongoose.model('Verification', verificationMailSchema)

module.exports = Verification