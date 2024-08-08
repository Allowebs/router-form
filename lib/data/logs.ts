"use server";

import { logs, endpoints } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { getErrorMessage } from "@/lib/helpers/error-message";

export async function createLog(
  type: "success" | "error",
  postType: "http" | "form",
  message: string,
  endpointId: string
) {
  await db.insert(logs).values({
    type,
    postType,
    message:
      type === "success" ? { success: true, id: message } : { error: message },
    createdAt: new Date(),
    endpointId,
  });

  revalidatePath("/logs");
}

export async function getLogs(userId: string) {
  const logsData = await db
    .select()
    .from(logs)
    .leftJoin(endpoints, eq(logs.endpointId, endpoints.id))
    .where(eq(endpoints.userId, userId))
    .orderBy(desc(logs.createdAt));

  const data: LogRow[] = logsData.map((log) => ({
    id: log.log.id,
    type: log.log.type,
    postType: log.log.postType,
    message: log.log.message,
    createdAt: log.log.createdAt,
    endpointId: log.endpoint?.id || "",
    endpoint: log.endpoint?.name || "",
  }));

  return data;
}

export async function deleteLog(id: string) {
  try {
    await db.delete(logs).where(eq(logs.id, id));
    revalidatePath("/logs");
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }
}
