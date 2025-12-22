interface NotificationResponseData {
  list: NotficationList[];
  total: number;
  unread: number;
}

interface NotficationList {
  id: string;
  userId: string;
  title: string;
  message: string;
  data: Data;
  createdAt: string;
  readAt: string;
  deeplink: string;
}

interface NotificationData {
  status: string;
  orderDetailId: string;
}

interface NotificationUnread {
  unread: number;
}

interface ReadNotificationPayload {
  id: string;
}

type NotificationResponse = BaseResponse<NotificationResponseData>;
type NotificationUnreadResponse = BaseResponse<NotificationUnread>;
