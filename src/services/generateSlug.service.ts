import crypto from "node:crypto";

const generateSlug = (name: string) => {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const randomSuffix = crypto.randomUUID().split("-")[0];

  const slug = `${baseSlug}-${randomSuffix}`;

  return slug;
};

export default generateSlug;
