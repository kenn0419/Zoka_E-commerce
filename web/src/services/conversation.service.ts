import { conversationApi } from "../apis/conversation.api";

export const conversationService = {
  async fetchAllMyConversations(
    params: IInfinityQueries,
  ): Promise<IInfinityResponse<IConversationResponse>> {
    const res = await conversationApi.fetchAllMyConversations(params);

    return res.data;
  },
  async fetchAiConversation(): Promise<IConversationResponse> {
    const res = await conversationApi.fetchAiConversation();
    return res.data;
  },
};
