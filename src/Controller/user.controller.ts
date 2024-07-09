import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { UserService } from "../Services/user.service";
import { inject } from "inversify";
import { TYPES } from "../types/types"
import { Iuser } from "../interface/model.interface";
import { ApiError } from "../utils/ApiError";
import { statuscode } from "../Constant/statuscode";
import { errMSG } from "../Constant/message";
import { Request, Response } from "express";
import { upload } from "../middleware/multer.middleware";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";

@controller('/user')
export class UserController {
    private user: UserService;

    constructor(@inject(TYPES.UserService) userServices: UserService) {
        this.user = userServices;

    }

    @httpPost('/signup', upload.fields([{
        name: "profilePicture",
        maxCount: 1
    }]))
    async signup(req: Request, res: Response) {
        try {

            const signupData: Iuser = req.body as unknown as Iuser;

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const profilePictureLocalpath = files?.profilePicture?.[0]?.path;
            signupData.profilePicture = profilePictureLocalpath;


            const created_user = await this.user.createUser(signupData);

            res.status(statuscode.ok).json(created_user.content);
        } catch (error: any) {
            res.status(error.statuscode || 500).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }

    @httpPost('/login')
    async login(req: Request, res: Response) {
        try {
            const loginData: Iuser = req.body as unknown as Iuser;

            if ([loginData.email, loginData.password].some((field) => field.trim() == "")) {
                throw new ApiError(statuscode.NotAcceptable, errMSG.exsistuser);
            }

            const login_user = await this.user.loginUser(loginData);

            res.status(login_user.statuscode).json(login_user.Content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }

    }

    @httpPost('/delete')
    async delete(req: Request, res: Response) {
        try {
            const userId = req.body.userId;
            if (!userId) {
                throw new ApiError(statuscode.NotAcceptable, errMSG.exsistuser);
            }

            const deleted_user = await this.user.deleteUser(userId);

            res.status(deleted_user.statuscode).json(deleted_user.content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }

    @httpPut('/updatepicture', new Auth().handler, new Role().handler, upload.fields([{
        name: "profilePicture",
        maxCount: 1
    }]))
    async updatepitcure(req: Request, res: Response) {
        try {

            const updateData: Iuser = req.body as Iuser;
            updateData.id = req.headers.USERID as string;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const profilePictureLocalpath = files?.profilePicture?.[0]?.path;
            updateData.profilePicture = profilePictureLocalpath;


            const updated_user = await this.user.updateUserwithprofilepicture(updateData);

            res.status(updated_user.statuscode).json(updated_user.Content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }
    @httpPut('/update', new Auth().handler, new Role().handler)
    async update(req: Request, res: Response) {
        try {

            const updateData: Iuser = req.body as Iuser;
            updateData.id = req.headers.USERID as string;

            const updated_user = await this.user.updateUserWithoutProfilePicture(updateData);

            res.status(updated_user.statuscode).json(updated_user.Content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }

    @httpGet('/getAll', new Auth().handler)
    async getAll(req: Request, res: Response) {
        try {
            const allUsers = await this.user.getAlluser();

            res.status(allUsers.statuscode).json(allUsers.content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult });
        }
    }



}