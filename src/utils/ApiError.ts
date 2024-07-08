import { injectable } from "inversify";
import { errMSG } from "../Constant/message";

@injectable()
export class ApiError extends Error {
   statusCode: number;

   constructor(
      statusCode: number,
      message = `${errMSG.defaultErrorMsg}`,

   ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
   }

}