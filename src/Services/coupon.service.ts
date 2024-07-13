import { injectable } from "inversify";
import { Icoupon } from "../interface/model.interface";
import Coupon from "../Model/coupons.model";
import { ApiError } from "../utils/ApiError";
import { statuscode } from "../Constant/statuscode";
import { errMSG, MSG } from "../Constant/message";
import { Icouponfilter } from "../interface/request.interface"
import mongoose from "mongoose";
import { Request } from "express";

@injectable()
export class CouponService {
  async getCoupons(couponData: any) {
    const Couponfilter: Icouponfilter = {
      Quantity: parseInt(couponData.Quantity),
      Category: couponData.Category,
      products: couponData.products,
      buyprice: parseInt(couponData.buyprice)
    };
  
    console.log("Couponfilter:", Couponfilter);
  
    try {
      const result = await Coupon.aggregate([
        {
          "$match": {
            "isActive": true,
            "endDate": { "$gte": new Date() },
            "$or": [
              { "conditions.conditionType": "Min Amount", "conditions.conditionValue": { "$lte": Couponfilter.buyprice } },
              { "conditions.conditionType": "Max Amount", "conditions.conditionValue": { "$gte": Couponfilter.buyprice } },
              { "conditions.conditionType": "Min Quantity", "conditions.conditionValue": { "$lte": Couponfilter.Quantity } },
              { "conditions.conditionType": "Max Quantity", "conditions.conditionValue": { "$gte": Couponfilter.Quantity } },
              { "conditions.conditionType": "Specific Product", "conditions.project_id": new mongoose.Types.ObjectId(Couponfilter.products) },
              { "conditions.conditionType": "Specific Category", "conditions.category_id": new mongoose.Types.ObjectId(Couponfilter.Category) }
            ]
          }
        }
      ]);
  
   
  
      result.forEach((coupon: Icoupon) => {
        if (coupon.type === "Percent-off" || coupon.type === "BOGO") {
          const percent = coupon.discountValue;
          coupon.payableprice = Couponfilter.buyprice - (Couponfilter.buyprice * percent) / 100;
        } else {
          coupon.payableprice = Couponfilter.buyprice - coupon.discountValue;
        }
      });
  
      // Sorting function
      result.sort((a: Icoupon, b: Icoupon) => {
        if (a.payableprice && b.payableprice) {
          if (a.payableprice < b.payableprice) return -1;
          if (a.payableprice > b.payableprice) return 1;
          return 0;
        } else if (!a.payableprice && b.payableprice) {
          return 1;
        } else if (a.payableprice && !b.payableprice) {
          return -1;
        } else {
          return 0;
        }
      });
      console.log("Sorted result:", result);
  
      return {
        statuscode: statuscode.ok,
        Content: result
      };
    } catch (error: any) {
      console.error("Error in getCoupons:", error);
      return {
        statuscode: error.statuscode || statuscode.InternalServerError,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
          data: error
        }
      };
    }
  }
  
  async createCoupon(coupon: Icoupon) {
    try {

      const result = await Coupon.create({
        code: coupon.code,
        type: coupon.type,
        discountValue: coupon.discountValue,
        isActive: coupon.isActive,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit,
        conditions: coupon.conditions
      });

      if (!result) {
        throw new ApiError(statuscode.NotImplemented, errMSG.notCreate('Coupon'))
      }

      return {
        statuscode: statuscode.ok,
        Content: {
          message: MSG.success("Category created"),
          data: result
        }
      }

    } catch (error: any) {
      return {
        statuscode: error.statuscode || statuscode.InternalServerError,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
          data: error
        }
      }
    }
  }
}