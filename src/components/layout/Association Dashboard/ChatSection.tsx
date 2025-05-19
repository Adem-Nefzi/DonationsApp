"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";
import _ from "lodash";
import {
  getAssociationMessages,
  getConversation,
  sendToUser,
  markMessagesAsRead,
  type Message,
} from "@/api/chat";

interface ConversationSummary {
  user_id: number;
  user_name: string;
  last_message: Message;
  unread_count: number;
  user_type: "donor";
}

export default function ChatSection() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationSummary[]
  >([]);
  const [activeConversation, setActiveConversation] =
    useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMobile();
  const [showConversations, setShowConversations] = useState(!isMobile);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getAssociationMessages();

        const grouped = _.groupBy(
          data.messages,
          (msg: Message) => msg.sender?.id || msg.sender_id
        );

        const convs: ConversationSummary[] = Object.entries(grouped)
          .map(([userIdStr, messages]) => {
            const sorted = messages.sort(
              (a, b) =>
                new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
            );
            const latest = sorted[0];
            const unreadCount = messages.filter((m) => !m.read_at).length;

            return {
              user_id: Number.parseInt(userIdStr),
              user_name: latest.sender
                ? `${latest.sender.first_name} ${latest.sender.last_name}`
                : "Unknown",
              last_message: latest,
              unread_count: unreadCount,
              user_type: "donor" as const,
            };
          })
          .filter((conv) => conv.user_type === "donor"); // Only keep donor conversations

        setConversations(convs);
        setFilteredConversations(convs);
        if (convs.length > 0) {
          setActiveConversation(convs[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const data = await getConversation(activeConversation.user_id);

          const processedMessages: Message[] = data.messages.map((message) => {
            if (!message.sender_type || !message.receiver_type) {
              if (message.sender_id !== activeConversation.user_id) {
                return {
                  ...message,
                  sender_type: "association",
                  receiver_type: "user",
                };
              } else {
                return {
                  ...message,
                  sender_type: "user",
                  receiver_type: "association",
                };
              }
            }
            return message;
          });

          setMessages(processedMessages);
          await markMessagesAsRead(activeConversation.user_id);

          setConversations((prev) =>
            prev.map((conv) =>
              conv.user_id === activeConversation.user_id
                ? { ...conv, unread_count: 0 }
                : conv
            )
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [activeConversation]);

  useEffect(() => {
    const filtered = conversations.filter((conv) =>
      conv.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    try {
      const sentMessage = await sendToUser(
        activeConversation.user_id,
        newMessage
      );

      const messageWithCorrectTypes: Message = {
        ...sentMessage,
        sender_type: "association",
        receiver_type: "user",
      };

      setMessages((prev) => [...prev, messageWithCorrectTypes]);
      setNewMessage("");

      setConversations((prev) =>
        prev.map((conv) =>
          conv.user_id === activeConversation.user_id
            ? {
                ...conv,
                last_message: {
                  ...messageWithCorrectTypes,
                  message_content: newMessage,
                  sent_at: new Date().toISOString(),
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isAssociationMessage = (message: Message): boolean => {
    return (
      message.sender_type === "association" ||
      (message.receiver_id === activeConversation?.user_id &&
        message.sender_type !== "user")
    );
  };

  return (
    <div className="flex h-[450px] rounded-md border">
      {showConversations && (
        <div className="w-full md:w-1/3 border-r">
          <div className="p-2 border-b">
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donors..."
                className="pl-8 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(450px-85px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.user_id}
                className={`flex items-start gap-2 p-2 hover:bg-muted/50 cursor-pointer ${
                  activeConversation?.user_id === conversation.user_id
                    ? "bg-muted"
                    : ""
                }`}
                onClick={() => {
                  setActiveConversation(conversation);
                  if (isMobile) setShowConversations(false);
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={conversation.user_name}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-xs">
                      {conversation.user_name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(
                        conversation.last_message.sent_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.last_message.message_content}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge className="ml-auto h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      <div className="flex flex-col w-full md:w-2/3">
        <div className="flex items-center justify-between p-2 border-b">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConversations(true)}
              className="md:hidden h-8 w-8"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg"
                alt={activeConversation?.user_name || ""}
              />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-xs">
                {activeConversation?.user_name}
              </h4>
              <p className="text-[10px] text-muted-foreground">Donor</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {messages.map((message) => {
              const fromAssociation = isAssociationMessage(message);

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    fromAssociation ? "justify-end" : "justify-start"
                  } gap-2`}
                >
                  {!fromAssociation && (
                    <Avatar className="h-6 w-6 mt-auto">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={activeConversation?.user_name || ""}
                      />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      fromAssociation
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-xs">{message.message_content}</p>
                    <span className="text-[10px] opacity-70 block text-right mt-1">
                      {new Date(message.sent_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {fromAssociation && (
                    <Avatar className="h-6 w-6 mt-auto bg-secondary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        A
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-2 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              className="h-8 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
