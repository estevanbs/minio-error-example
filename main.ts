import * as minio from "minio";
import * as fs from "node:fs";
import { PassThrough, type Writable } from "node:stream";
import dotenv from "dotenv";

dotenv.config();

const minioClient = new minio.Client({
	endPoint: process.env.MINIO_ENDPOINT!,
	accessKey: process.env.MINIO_ACCESS_KEY!,
	secretKey: process.env.MINIO_SECRET_KEY!,
});

function uploadFile(destinationObject: string): Writable {
	const pass = new PassThrough();

	minioClient
		.putObject(process.env.MINIO_BUCKET!, destinationObject, pass)
		.catch(console.log);

	return pass;
}

function main() {
	const readableStream = fs.createReadStream("file.txt");
	const uploadStream = uploadFile("uploads/file.txt");

	readableStream.pipe(uploadStream);
}

main();
