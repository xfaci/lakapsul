export const buildPagination = (page = 1, pageSize = 20) => {
  const limit = Math.max(pageSize, 1);
  const offset = Math.max(page - 1, 0) * limit;
  return { limit, offset };
};
