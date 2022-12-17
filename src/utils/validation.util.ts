import { ApiError } from "../error-handling/ApiError";
import { BAD_REQUEST } from "../types/error.type";

export function validateFields({
  fields,
  item,
  action,
  itemName,
}: {
  fields: string[];
  item: any;
  action: string;
  itemName: string;
}) {
  fields.forEach((field) => {
    if (!item[field])
      throw new ApiError(
        `Attribute ${field} is necessary for ${action} a ${itemName}`,
        BAD_REQUEST
      );
  });
}
