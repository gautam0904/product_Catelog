import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { Role } from "../middleware/role.middleware";
import { Auth } from "../middleware/auth.middleware";
import { CouponService } from "../Services";
import { TYPES } from "../types/types";
import { inject } from "inversify";
import { statuscode } from "../Constant/statuscode";


@controller('/coupon', new Auth().handler)
export class CouponController {
	private couponService: CouponService;

	constructor(@inject(TYPES.CouponService) coupon: CouponService) {
		this.couponService = coupon;

	}
	@httpPost('/create', new Role().handler)
	async createCoupon(req: Request, res: Response) {
		try {
			const couponData = req.body;

			const createdCoupon = await this.couponService.createCoupon(couponData);

			res.status(createdCoupon.statuscode).json(createdCoupon.Content)
		} catch (error: any) {
			res.status(error.statusCode || statuscode.InternalServerError).json({
				message: error.message
			})
		}
	}

	@httpGet('/get', new Role().handler)
	async getCoupon(req: Request, res: Response) {
		try {
			const couponData = {
				Quantity: parseInt(req.query.Quantity as string),
				Amount: parseInt(req.query.Amount as string),
				products: req.query.Product as string,
				Category: req.query.Category as string,
				buyprice: parseInt(req.query.buyprice as string)
			}

			const getCoupon = await this.couponService.getCoupons(couponData);

			res.status(getCoupon.statuscode).json(getCoupon.Content)
		} catch (error: any) {
			res.status(error.statusCode || statuscode.InternalServerError).json({
				message: error.message
			})
		}
	}
}