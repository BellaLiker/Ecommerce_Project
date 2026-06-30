import * as NotifRepo from "../repositories/notification.repository.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.util.js";

export const getNotifications = async (userId, query) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total, unread } = await NotifRepo.findByUser(userId, { limit, offset });
  return { notifications: rows, unread, pagination: buildPaginationMeta(total, page, limit) };
};

export const markRead = (id, userId) => NotifRepo.markRead(id, userId);
export const markAllRead = (userId) => NotifRepo.markAllRead(userId);
