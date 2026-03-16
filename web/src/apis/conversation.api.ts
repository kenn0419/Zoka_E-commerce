import instance from "./axios-customize";

export const conversationApi = {
  fetchAllMyConversations: async (
    params: IInfinityQueries,
  ): Promise<IApiResponse<IInfinityResponse<IConversationResponse>>> => {
    return await instance.get(`/chats/conversations`, { params });
  },
  fetchAiConversation: async (): Promise<IApiResponse<IConversationResponse>> => {
    return await instance.get(`/chats/ai-conversation`);
  },
};
