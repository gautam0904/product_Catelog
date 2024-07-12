import mongoose from "mongoose";
import { errMSG } from "../Constant/message";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, errMSG.required('Coupon Code')],
  },
  type: {
    type: String,
    required: [true, errMSG.required('Coupon Type')],
    enum: ['Mobile', 'Mystery', 'Friends and Family', 'Gift Card', 'Automatic', 'BOGO', 'Loyalty', 'Free Gift', 'Free Shipping', 'Percent-off']
  },
  discountValue: {
    type: Number,
    required: [true, errMSG.required('Coupon Discount Value')],
  },
  isActive: {
    type: Boolean,
    required: [true, errMSG.required('Coupon Is Active')],
    default: true
  },
  startDate: {
    type: Date,
    required: [true, errMSG.required('Coupon Start Date')],
  },
  endDate: {
    type: Date,
    required: [true, errMSG.required('Coupon End Date')],
  },
  usageLimit: {
    type: Number,
    required: [true, errMSG.required('Coupon Usage Limit')],
  },
  conditions: [
    {
      conditionType: {
        type: String,
        required: [true, errMSG.required('Coupon Condition Type')],
        enum: ['Min Quantity', 'Max Quantity', 'Min Amount', 'Max Amount', 'Specific Product', 'Specific Category']
      },
      conditionValue: {
        type: Number,
        required: [true, errMSG.required('Coupon Condition Value')]
      },
      project_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
      }
    }
  ]
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);


export default Coupon;