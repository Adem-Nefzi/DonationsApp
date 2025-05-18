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
import { fetchAllAssociations } from "@/api/crud"; // Adjust the import path as needed

// Extend the Message type with additional fields used in the component
interface Message extends ApiMessage {
  sender_name?: string;
}

interface Association {
  id: number;
  name: string;
  avatar?: string;
  logo?: string; // Some APIs might use logo instead of avatar
  description?: string;
  category?: string;
}

interface ConversationSummary {
  association_id: number;
  association_name: string;
  association_avatar?: string;
  last_message?: Message;
  unread_count: number;
  has_conversation: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all associations
        const associationsData = await fetchAllAssociations();
        const associations: Association[] = Array.isArray(associationsData)
          ? associationsData
          : associationsData.associations || [];

        // Create a map of all associations for quick lookup
        const associationsMap = new Map(
          associations.map((assoc) => [
            assoc.id,
            {
              name: assoc.name,
              avatar: assoc.avatar || assoc.logo,
            },
          ])
        );

        // Fetch user messages to get existing conversations
        const messagesData = await getUserMessages();
        const userMessages = messagesData.messages || [];

        // Group messages by association
        const grouped = _.groupBy(
          userMessages,
          (msg: Message) => msg.sender_id
        );

        // Create conversation summaries from existing messages
        const existingConversations: ConversationSummary[] = Object.entries(
          grouped
        ).map(([associationIdStr, messages]) => {
          const associationId = Number.parseInt(associationIdStr);
          const sorted = messages.sort((a, b) => {
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

          // Get association details from the map
          const associationDetails = associationsMap.get(associationId);

          return {
            association_id: associationId,
            association_name:
              associationDetails?.name ||
              ((latest as Message).sender &&
                (latest as Message).sender?.name) ||
              "Unknown Association",
            association_avatar: associationDetails?.avatar,
            last_message: latest as Message,
            unread_count: unreadCount,
            has_conversation: true,
          };
        });

        // Create a set of association IDs that already have conversations
        const existingAssociationIds = new Set(
          existingConversations.map((conv) => conv.association_id)
        );

        // Add associations that don't have conversations yet
        const additionalConversations: ConversationSummary[] = associations
          .filter((assoc) => !existingAssociationIds.has(assoc.id))
          .map((assoc) => ({
            association_id: assoc.id,
            association_name: assoc.name,
            association_avatar: assoc.avatar || assoc.logo,
            unread_count: 0,
            has_conversation: false,
          }));

        // Combine and sort all conversations
        const allConversations = [
          ...existingConversations,
          ...additionalConversations,
        ].sort((a, b) => {
          // First sort by whether they have conversations
          if (a.has_conversation && !b.has_conversation) return -1;
          if (!a.has_conversation && b.has_conversation) return 1;

          // If both have conversations, sort by last message time
          if (
            a.has_conversation &&
            b.has_conversation &&
            a.last_message &&
            b.last_message
          ) {
            return (
              new Date(b.last_message.sent_at).getTime() -
              new Date(a.last_message.sent_at).getTime()
            );
          }

          // Otherwise sort alphabetically
          return a.association_name.localeCompare(b.association_name);
        });

        setConversations(allConversations);
        setFilteredConversations(allConversations);

        // Set active conversation if there is one
        if (allConversations.length > 0) {
          // Prefer conversations with messages
          const conversationWithMessages = allConversations.find(
            (c) => c.has_conversation
          );
          setActiveConversation(
            conversationWithMessages || allConversations[0]
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          // Only fetch messages if this association has a conversation
          // or if we're starting a new conversation
          const data = await getConversation(activeConversation.association_id);

          // Process messages to ensure correct sender/receiver identification
          const processedMessages: Message[] = data.messages.map((message) => {
            // Determine if this message is from the user (donor) or the association
            const isFromUser =
              message.sender_type === "user" ||
              message.sender_id !== activeConversation.association_id;

            return {
              ...message,
              // Ensure proper sender type is set
              sender_type: isFromUser ? "user" : "association",
              receiver_type: isFromUser ? "association" : "user",
              // Add display name for UI
              sender_name: isFromUser
                ? "You"
                : activeConversation.association_name,
            };
          });

          setMessages(processedMessages);

          // Only mark as read if there are messages
          if (processedMessages.length > 0) {
            await markMessagesAsRead(activeConversation.association_id);

            // Update unread count after marking as read
            setConversations((prev) =>
              prev.map((conv) =>
                conv.association_id === activeConversation.association_id
                  ? { ...conv, unread_count: 0 }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          // If error occurs because there's no conversation yet, just set empty messages
          setMessages([]);
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

      // Update conversation in the list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.association_id === activeConversation.association_id
            ? {
                ...conv,
                last_message: newMsg,
                has_conversation: true,
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
    // Check sender_type to ensure accurate identification
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
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No associations found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
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
                      src={
                        conversation.association_avatar || "/placeholder.svg"
                      }
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
                      {conversation.last_message && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(
                            conversation.last_message.sent_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.last_message ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.last_message.message_content}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                  {conversation.unread_count > 0 && (
                    <Badge className="ml-auto h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              ))
            )}
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
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  No messages yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Send a message to start a conversation with{" "}
                  {activeConversation.association_name}
                </p>
              </div>
            ) : (
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
                          <AvatarImage
                            src={
                              activeConversation.association_avatar ||
                              "/placeholder.svg"
                            }
                            alt={message.sender_name || ""}
                          />
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
            )}
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
