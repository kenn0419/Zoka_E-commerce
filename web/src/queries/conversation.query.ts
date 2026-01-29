import { useInfiniteQuery } from "@tanstack/react-query";
import { conversationService } from "../services/conversation.service";

export function useConversations() {
  return useInfiniteQuery<IInfinityResponse<IConversationResponse>>({
    queryKey: ["conversations"],
    queryFn: ({ pageParam }) =>
      conversationService.fetchAllMyConversations({
        cursor: pageParam as string,
        limit: 10,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
    initialPageParam: undefined,
  });
}
