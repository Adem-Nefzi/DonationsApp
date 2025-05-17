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
  getConversation,
  getUserMessages,
  sendToAssociation,
  markMessagesAsRead,
  type Message as ApiMessage,
} from "@/api/chat";

// Extend the Message type with additional fields used in the component
interface Message extends ApiMessage {
  sender_name?: string;
}

interface ConversationSummary {
  association_id: number;
  association_name: string;
  association_avatar?: string;
  last_message: Message;
  unread_count: number;
}

export default function DonorChatSection() {
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
        const data = await getUserMessages();

        // Group messages by association
        const grouped = _.groupBy(
          data.messages,
          (msg: Message) => msg.sender_id // Group by sender_id since associations are the senders
        );

        // Create conversation summaries
        const convs: ConversationSummary[] = Object.entries(grouped).map(
          ([associationIdStr, messages]) => {
            const sorted = messages.sort((a, b) => {
              // Ensure we're working with Message objects
              const aMessage = a as Message;
              const bMessage = b as Message;
              return (
                new Date(bMessage.sent_at).getTime() -
                new Date(aMessage.sent_at).getTime()
              );
            });
            const latest = sorted[0];
            const unreadCount = messages.filter(
              (m) => !(m as Message).read_at
            ).length;

            return {
              association_id: Number.parseInt(associationIdStr),
              association_name:
                ((latest as Message).sender &&
                  (latest as Message).sender?.name) ||
                "Unknown Association",
              last_message: latest as Message, // Explicitly cast to Message type
              unread_count: unreadCount,
            };
          }
        );

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
          const data = await getConversation(activeConversation.association_id);

          // Process messages to ensure correct sender/receiver identification
          const processedMessages: Message[] = data.messages.map((message) => {
            // Determine if this message is from the user (donor) or the association
            const isFromUser =
              message.sender_type === "user" ||
              message.sender_id !== activeConversation.association_id;

            return {
              ...message,
              sender_type: isFromUser ? "user" : "association",
              receiver_type: isFromUser ? "association" : "user",
              sender_name: isFromUser
                ? "You"
                : activeConversation.association_name,
            };
          });

          setMessages(processedMessages);
          await markMessagesAsRead(activeConversation.association_id);

          // Update unread count after marking as read
          setConversations((prev) =>
            prev.map((conv) =>
              conv.association_id === activeConversation.association_id
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
      conv.association_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    try {
      const sentMessage = await sendToAssociation(
        activeConversation.association_id,
        newMessage
      );

      // Add the new message to the chat with explicit sender/receiver types
      const newMsg: Message = {
        ...sentMessage,
        sender_type: "user", // Explicitly set as user message
        receiver_type: "association", // Explicitly set receiver as association
        sender_name: "You",
        message_content: newMessage,
        sent_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.association_id === activeConversation.association_id
            ? {
                ...conv,
                last_message: newMsg,
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Helper function to determine if a message is from the user (donor)
  const isUserMessage = (message: Message): boolean => {
    // Check both sender_type and sender_id to ensure accurate identification
    return message.sender_type === "user";
  };

  return (
    <div className="flex h-[450px] rounded-md border">
      {showConversations && (
        <div className="w-full md:w-1/3 border-r">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search associations..."
                className="pl-8 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(450px-57px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.association_id}
                className={`flex items-start gap-2 p-2 hover:bg-muted/50 cursor-pointer ${
                  activeConversation?.association_id ===
                  conversation.association_id
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
                    src={conversation.association_avatar || "/placeholder.svg"}
                    alt={conversation.association_name}
                  />
                  <AvatarFallback>
                    {conversation.association_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-xs">
                      {conversation.association_name}
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

      {activeConversation && (
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
                  src={
                    activeConversation.association_avatar || "/placeholder.svg"
                  }
                  alt={activeConversation.association_name}
                />
                <AvatarFallback>
                  {activeConversation.association_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-xs">
                  {activeConversation.association_name}
                </h4>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {messages.map((message) => {
                const fromUser = isUserMessage(message);

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      fromUser ? "justify-end" : "justify-start"
                    } gap-2`}
                  >
                    {!fromUser && (
                      <Avatar className="h-6 w-6 mt-auto">
                        <AvatarImage alt={message.sender_name || ""} />
                        <AvatarFallback>
                          {(message.sender_name || "A").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        fromUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {!fromUser && (
                        <p className="text-[10px] font-medium mb-1">
                          {message.sender_name ||
                            activeConversation.association_name}
                        </p>
                      )}
                      <p className="text-xs">{message.message_content}</p>
                      <span className="text-[10px] opacity-70 block text-right mt-1">
                        {new Date(message.sent_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {fromUser && (
                      <Avatar className="h-6 w-6 mt-auto bg-secondary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-3 w-3" />
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
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={handleSendMessage}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
