import { db } from "./db";
import { roots, type InsertRoot } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

export interface IStorage {
  getRootByQuery(query: string): Promise<typeof roots.$inferSelect | undefined>;
  getRecentRoots(limit?: number): Promise<(typeof roots.$inferSelect)[]>;
  createRoot(root: InsertRoot): Promise<typeof roots.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getRootByQuery(query: string): Promise<typeof roots.$inferSelect | undefined> {
    const [root] = await db
      .select()
      .from(roots)
      .where(
        eq(roots.word, query)
      )
      .limit(1);

    if (root) return root;

    const [rootByRoot] = await db
      .select()
      .from(roots)
      .where(
        eq(roots.root, query)
      )
      .limit(1);

    return rootByRoot;
  }

  async getRecentRoots(limit: number = 10): Promise<(typeof roots.$inferSelect)[]> {
    return await db.select().from(roots).orderBy(roots.createdAt).limit(limit);
  }

  async createRoot(root: InsertRoot): Promise<typeof roots.$inferSelect> {
    const [created] = await db.insert(roots).values(root).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
