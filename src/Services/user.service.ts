import { injectable } from "inversify";
import { Iuser } from "../interface/model.interface";
import User from "../Model/user.model";
import { ApiError } from "../utils/ApiError";
import { statuscode } from "../Constant/statuscode";
import { errMSG, MSG } from "../Constant/message";
import { deleteonCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

@injectable()
export class UserService {
  constructor() {
  }
  cloudinaryurl = ""

  async createUser(userData: Iuser) {
    try {
      const existuser = await User.findOne({ email: userData.email });

      if (existuser) {
        throw new ApiError(statuscode.Conflict, errMSG.exsistuser)
      }

      const profile = await uploadOnCloudinary(userData.profilePicture);
      this.cloudinaryurl = profile?.url || "";

      const result = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        profilePicture: profile?.url || ""
      });
      this.cloudinaryurl = "";
      return {
        statusCode: statuscode.ok,
        content: {
          message: MSG.usercreated,
          data: result
        }
      }
    } catch (error: any) {
      deleteonCloudinary(this.cloudinaryurl).then((response) => {
        this.cloudinaryurl = "";
      })

      return {
        statusCode: statuscode.ok,
        content: {
          message: error.message || errMSG.InternalServerErrorResult,
        }
      }
    }
  }
  async loginUser(userData: Iuser) {
    try {
      const existUser = await User.findOne({
        email: userData.email
      });

      if (!existUser) {
        throw new ApiError(statuscode.NoteFound, errMSG.notExistUser)
      }

      const isMatch = await bcrypt.compare(userData.password, existUser.password);

      if (!isMatch) {
        throw new ApiError(statuscode.NotAcceptable, errMSG.passwordNotMatch)
      }

      const token = jwt.sign(
        {
          id: existUser._id,
          role: existUser.role
        },
        process.env.AccessTokenSeceret as string,
        {
          expiresIn: process.env.AccessExpire
        });

      return {
        statuscode: statuscode.ok,
        Content: {
          message: MSG.success('User logged in'),
          data: {
            token: token,
            user: existUser
          }
        }

      }
    } catch (error: any) {
      return {
        statuscode: error.statuscode,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
        }
      }
    }
  }

  async deleteUser(userId: string) {
    try {
      const existUser = await User.findOne({ _id: userId });

      if (!existUser) {
        throw new ApiError(statuscode.NoteFound, `${errMSG.notExistUser}`);
      }
      const result = await User.findByIdAndDelete(
        { _id: existUser._id }
      );
      return {
        statuscode: statuscode.ok,
        content: {
          message: MSG.success('user deleted'),
        },
      };
    } catch (error: any) {
      return {
        statuscode: error.statusCode || statuscode.NotImplemented,
        content: { message: error.message },
      };
    }
  }

  async getAlluser() {
    try {
      const users = await User.aggregate([
        {
          $match: {},
        },
        {
          $project: {
            name: 1,
            email: 1,
            usertype: 1,
            createdAt: 1,
            profilepic: 1,
            _id: 1
          },
        },
        {
          $sort: {
            createdAt: -1
          }
        }
      ]);
      if (users) {
        return {
          statuscode: statuscode.ok,
          content: { users },
        };
      } else {
        throw new ApiError(statuscode.NoteFound, `${errMSG.userNotFound}`);
      }
    } catch (error: any) {
      return {
        statuscode: error.statusCode || statuscode.NotImplemented,
        content: { message: error.message },
      };
    }
  }

  async updateUserwithprofilepicture(updateData: Iuser): Promise<{ statuscode: any; Content: any; }> {
    try {
  
      const existUser = await User.findById(updateData.id);
  
      let result;
      await deleteonCloudinary(existUser?.profilePicture as string).then(async (response) => {
        const profile = await uploadOnCloudinary(updateData.profilePicture);
        result = await User.findByIdAndUpdate(
          {
            _id: updateData.id,
          },
          {
            $set: {
              name: updateData.name,
              email: updateData.email,
              profilePicture: profile?.url
            },
          },
          { new: true }
        );
        if (result) {
          return {
            statuscode: statuscode.ok,
            Content: result,
          };
        }
        throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
      }).catch((err: any) => {
        throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
      });
  
      return {
        statuscode: statuscode.ok,
        Content: result,
      };
  
    } catch (error: any) {
      deleteonCloudinary(this.cloudinaryurl).then((response) => {
        this.cloudinaryurl = "";
      });
      return {
        statuscode: error.statusCode || statuscode.NotImplemented,
        Content: error.message,
      };
    }
  }
  
  async updateUserWithoutProfilePicture(updateData: Iuser) {
    try {

      const result = await User.findByIdAndUpdate(
        {
          _id: updateData.id,
        },
        {
          $set: {
            name: updateData.name,
            email: updateData.email,
          },
        },
        { new: true }
      );
      if (result) {
        return {
          statuscode: statuscode.ok,
          Content: result,
        };
      }
      throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
    } catch (error: any) {
      return {
        statuscode: error.statusCode || statuscode.NotImplemented,
        Content: error.message,
      };
    }
  }


}