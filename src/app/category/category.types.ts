export interface IGetCategoryParams {
  id?: string;
  name?: string;
  slug?: string;
  parentId?: string;
  level?: number;
  isActive?: boolean;

  includeChildren?: boolean;
  includeParent?: boolean;

  sortBy: "name" | "createdAt" | "sortOrder" | "level";
  sortOrder?: "asc" | "desc";

  page?: number;
  limit?: number;
}
