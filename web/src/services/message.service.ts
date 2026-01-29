import { messageApi } from "../apis/message.api";

export const messageService = {
  async fetchMessagesByConversation(
    conversationId: string,
    params: IInfinityQueries,
  ): Promise<IInfinityResponse<IMessageResponse>> {
    const res = await messageApi.fetchMessagesByConversation(
      conversationId,
      params,
    );

    return res.data;
  },
};
