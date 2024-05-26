import { RequestHandler } from "express";
import PostModel from "../../models/Posts/PostModel";
import ResponseService from "../../utils/ResponseService";
import { TEXT } from "../../utils/JoiErrors";
import { STATUS_TYPES_ENUM } from "../../constants/PostStatusEnum";
import { postValidationSchema, validateStatusFields } from "../../utils/validation";

const CreatePostController: RequestHandler = async (req, res) => {
  console.log("CreatePostController -> req.body", req.body);
  if (await validateStatusFields(postValidationSchema, req.body, res)) return;
  try {
    const textForUrl = req.body.url
      ? req.body.url.toLowerCase().replace(/ /g, "-")
      : req.body.title.toLowerCase().replace(/ /g, "-");
    const existingPost = await PostModel.findOne({
      url: textForUrl,
    });
    if (existingPost) {
      return ResponseService.error(res, TEXT.ERRORS.postExists);
    }
    const newPost = await PostModel.create({
      ...req.body,
      title: req.body.title,
      status: STATUS_TYPES_ENUM.DRAFT,
    });

    ResponseService.success(res, newPost);
  } catch (error: any) {
    const message = error.code === 11000 ? TEXT.ERRORS.postExists : error.message;
    res.status(400).json({
      error: message,
    });
  }
};

export default CreatePostController;
