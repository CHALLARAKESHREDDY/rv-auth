import { NextFunction, Request, Response } from "express";
import { userUpdateDetailsSchema } from "../schema/auth";
import { prisma } from "../prisma";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { deleteFromS3 } from "../components/delete-s3";
import { TAKE_LIMIT } from "../secrets";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user);
};

export const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedData = userUpdateDetailsSchema.parse(req.body);
  const updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data: validatedData,
    select: {
      id: true,
    },
  });
  res.json({ message: "Updated Sucessfully" });
};


export const getMyPosts = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user.id;
  
  const skip = Number(req.query.skip) || 0; 
  const take = Number(TAKE_LIMIT) || 10; 

  // Step 1: Fetch user's posts with itemType and itemId in a single query
  const myPosts = await prisma.myPosts.findMany({
    skip,
    take,
    where: { userId },
    select: { itemId: true, itemType: true },
  });

  // Return early if no posts are found
  if (!myPosts || myPosts.length === 0) {
    return res.json({ message: "You don't have any posts right now." });
  }

  // Step 2: Build a query to fetch details of CATTLE and TOOL items in parallel
  const cattleIds = myPosts
    .filter((post) => post.itemType === "CATTLE")
    .map((post) => post.itemId);
  const toolIds = myPosts
    .filter((post) => post.itemType === "TOOL")
    .map((post) => post.itemId);

  const [cattleDetails, toolDetails] = await Promise.all([
    prisma.cattle.findMany({
      where: { id: { in: cattleIds } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: { select: { url: true } },
      },
    }),
    prisma.farmTools.findMany({
      where: { id: { in: toolIds } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: { select: { url: true } },
      },
    }),
  ]);

  // Step 3: Combine the details with item types
  const postsDetails = [...cattleDetails, ...toolDetails]; // Direct combination if you want a single array
  res.json({ myPosts: postsDetails });
};



export const deleteMypost = async (req: Request, res: Response) => {
  const mypostId = parseInt(req.params.id);
  const userId = req.user.id;

  // Fetch post data and verify user ownership in a single query
  const post = await prisma.myPosts.findFirst({
    where: { id: mypostId, userId },
    select: { itemType: true, itemId: true },
  });

  if (!post) {
    throw new UnAuthorizedException(
      "Unauthorized or post not found",
      ErrorCode.UNAUTHORIZED
    );
  }

  let imageUrls: string[] = [];

  await prisma.$transaction(async (tx) => {
    await tx.myPosts.delete({ where: { id: mypostId } });

    // Delete from respective tables and gather image URLs
    if (post.itemType === "CATTLE") {
      imageUrls = (
        await tx.cattle.delete({
          where: { id: post.itemId },
          select: { images: { select: { url: true } } },
        })
      ).images.map((img) => img.url);
    } else if (post.itemType === "TOOL") {
      imageUrls = (
        await tx.farmTools.delete({
          where: { id: post.itemId },
          select: { images: { select: { url: true } } },
        })
      ).images.map((img) => img.url);
    } else {
      throw new Error("Invalid post type");
    }
  });

  // Attempt to delete images from S3, catching any errors without interrupting the response
  if (imageUrls.length > 0) {
    try {
      await Promise.all(
        imageUrls.map((url: string) =>
          deleteFromS3(new URL(url).pathname.substring(1))
        )
      );
    } catch (s3Error) {
      console.error("Failed to delete some images from S3:", s3Error);
      // You can log specific details or handle the error further as needed
    }
  }

  res.json({ message: "Post and associated images deleted successfully." });
};
