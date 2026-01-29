import instance from "./axios-customize";

export const messageApi = {
  fetchMessagesByConversation: async (
    conversationId: string,
    params: IInfinityQueries,
  ): Promise<IApiResponse<IInfinityResponse<IMessageResponse>>> => {
    return await instance.get(`/chats/messages/${conversationId}`, {
      params,
    });
  },
};
