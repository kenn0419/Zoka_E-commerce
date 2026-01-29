import { useInfiniteQuery } from "@tanstack/react-query";
import { messageService } from "../services/message.service";

export function useMessages(conversationId?: string) {
  return useInfiniteQuery<IInfinityResponse<IMessageResponse>>({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: ({ pageParam }) =>
      messageService.fetchMessagesByConversation(conversationId!, {
        cursor: pageParam as string,
        limit: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
    initialPageParam: undefined,
  });
}
