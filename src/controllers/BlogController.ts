import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';

import { matchedData, validationResult } from 'express-validator';
import AppError from '../utils/AppError';
import Blog from '../model/blogModel';

class BlogController {
  create = catchAsync(async (req: Request, res: Response) => {
    const { title, content, description } = req.body;
    // const result = validationResult(req);

    // if(!result){
    //     return next(new AppError('some erorrs here', 401))
    // }
    // const data = matchedData(req);

    const blogData = await Blog.create(req.body);

    res.status(201).json({
      data: blogData
    });
  });

  getAll = catchAsync(async (_, res: Response) => {
    const blogs = await Blog.find({ deleted: false });
    res.status(201).json({
      data: blogs
    });
  });

  getOne = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const blog = await Blog.findById(id);

      if (!blog) {
        return next(new AppError('some erorrs here', 401));
      }

      res.status(201).json({
        data: blog
      });
    }
  );

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedblog = await Blog.findByIdAndUpdate(
      id,
      { deleted: true },
      {
        new: true
      }
    );

    res.status(201).json({
      message: 'Blog deleted succesfully'
    });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, description } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      title,
      content,
      description
    });

    res.status(201).json({
      message: 'Blog updated succesfully',
      data: updatedBlog
    });
  });
}

export default new BlogController();
