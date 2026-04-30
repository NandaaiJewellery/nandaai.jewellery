import { Router, Request, Response } from "express";
import { ImageService } from "../services/image.service";

const router = Router();
const imageService = new ImageService();

router.get("/:key(*)", async (req: Request, res: Response) => {
  try {
    const key = req.params.key;

    const { stream, contentType, contentLength } =
      await imageService.getImageStream(key);

    // headers
    res.setHeader("Content-Type", contentType);

    if (contentLength) {
      res.setHeader("Content-Length", contentLength.toString());
    }

    res.setHeader("Cache-Control", "public, max-age=31536000");

    // pipe directly
    (stream as any).pipe(res);

  } catch (err: any) {
    console.error(err);

    if (err.message === "NOT_FOUND" || err.name === "NoSuchKey") {
      return res.status(404).json({ error: "File not found" });
    }

    if (err.message === "Key is required") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Failed to fetch image" });
  }
});

export default router;