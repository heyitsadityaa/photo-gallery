import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    images: defineTable({
        name: v.string(),
        url: v.string(),
        // uploadUrl: v.string(),
        // imageUrl: v.string(),
        body: v.id("_storage"),

        // description: v.string(),
        // createdAt: v.string(),
    })
})