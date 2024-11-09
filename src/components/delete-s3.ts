import {
  DeleteObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from "../secrets";
import { InternalException } from "../exceptions/unhandled";
import { ErrorCode } from "../exceptions/root";

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Function to delete a file from S3
export const deleteFromS3 = async (key: string): Promise<void> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    // Attempt to delete from S3
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new InternalException(
      "Failed to delete image fom s3!",
      error,
      ErrorCode.INTERNAL_EXCEPTION
    );
  }
};
