export class PaginationDTO<T> {
  page: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalItems: number;
  items: T;

  constructor(page: number = 1, count: number, limit: number = 10, items: T) {
    this.page = page;
    this.hasNextPage = Math.ceil(count / limit) > page;
    this.hasPreviousPage = page - 1 > 0;
    this.totalItems = count;
    this.items = items;
  }
}
