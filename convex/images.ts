import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addImage = mutation({
    args: {
        name: v.string(),
        storageId: v.id("_storage"),
        // description: v.string(),
    },
    async handler(ctx, args) {
        const imageUrl = await ctx.storage.getUrl(args.storageId);
        if (!imageUrl) {
            throw new Error(`Failed to get URL for storage ID: ${args.storageId}`);
        }

        await ctx.db.insert("images", {
            name: args.name,
            url: imageUrl,
            body: args.storageId,
        })
    }
})

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const getImages = query({
    args: {},
    async handler(ctx, args) {
        const images = await ctx.db.query("images").collect()
        return Promise.all(images.map(async (image) => ({
            ...image,
            url: image.body ? await ctx.storage.getUrl(image.body) : null,
        })))
    }
})