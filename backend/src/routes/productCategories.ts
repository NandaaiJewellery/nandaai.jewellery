import { Router, Request, Response, NextFunction } from "express";
import { ProductCategoryService } from "../services/productCategory.service";

const router = Router();
const service = new ProductCategoryService();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    const category = await service.createCategory(name, slug);

    res.status(201).json({
      success: true,
      data: category,
    });
  })
);

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await service.getAllCategories();
    res.json(categories);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const category = await service.getCategoryById(req.params.id);

    res.json({
      success: true,
      data: category,
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    const category = await service.updateCategory(
      req.params.id,
      name,
      slug
    );

    res.json({
      success: true,
      data: category,
    });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await service.deleteCategory(req.params.id);

    res.json({
      success: true,
      message: "Category deleted",
    });
  })
);

export default router;