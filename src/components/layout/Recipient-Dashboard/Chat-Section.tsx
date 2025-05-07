"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Building, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";

// Mock data for conversations with associations
const conversations = [
  {
    id: "1",
    name: "Helping Hands Foundation",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your request for winter clothes has been approved.",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Food for All",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We need more information about your food assistance request.",
    time: "Yesterday",
    unread: 1,
  },
  {
    id: "3",
    name: "Children's Hope Alliance",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The school supplies will be available for pickup on Monday.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "4",
    name: "Medical Relief Initiative",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage:
      "We're sorry, but we currently don't have those medications in stock.",
    time: "2 days ago",
    unread: 0,
  },
];

// Mock data for messages
const messages = [
  {
    id: "1",
    sender: "Me",
    content:
      "Hello, I submitted a request for winter clothes for my family. We're a family of 5 with 3 children ages 5, 8, and 10.",
    time: "10:15 AM",
    isMe: true,
  },
  {
    id: "2",
    sender: "Helping Hands Foundation",
    content:
      "Thank you for reaching out. We've received your request and are reviewing it.",
    time: "10:18 AM",
    isMe: false,
  },
  {
    id: "3",
    sender: "Me",
    content:
      "Thank you. We really need warm jackets and gloves for the children before the cold weather arrives.",
    time: "10:22 AM",
    isMe: true,
  },
  {
    id: "4",
    sender: "Helping Hands Foundation",
    content:
      "We understand. Could you provide the sizes needed for each family member?",
    time: "10:25 AM",
    isMe: false,
  },
  {
    id: "5",
    sender: "Me",
    content: "Adults: Medium and Large. Children: sizes 6, 8, and 10.",
    time: "10:28 AM",
    isMe: true,
  },
  {
    id: "6",
    sender: "Helping Hands Foundation",
    content:
      "Your request for winter clothes has been approved. You can pick them up at our center at 123 Main St anytime between 9 AM and 5 PM on Monday, December 20.",
    time: "10:30 AM",
    isMe: false,
  },
];

export default function ChatSection() {
  const [activeConversation, setActiveConversation] = useState(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMobile();
  const [showConversations, setShowConversations] = useState(!isMobile);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[450px] rounded-md border md:flex-row">
      {showConversations && (
        <div className="w-full md:w-1/3 border-r md:border-b-0 border-b">
          <div className="p-2 md:p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 md:left-3 top-2.5 md:top-3 h-4 md:h-5 w-4 md:w-5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 md:pl-10 h-8 md:h-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(450px-41px)] md:h-[calc(450px-56px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-start gap-2 md:gap-3 p-2 md:p-3 hover:bg-muted/50 cursor-pointer ${
                  activeConversation.id === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setActiveConversation(conversation);
                  if (isMobile) setShowConversations(false);
                }}
              >
                <Avatar className="h-8 md:h-10 w-8 md:w-10">
                  <AvatarImage
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                  />
                  <AvatarFallback>
                    <Building className="h-4 md:h-5 w-4 md:w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-xs">{conversation.name}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="ml-auto md:ml-2 h-4 md:h-5 w-4 md:w-5 flex items-center justify-center p-0 text-[10px]">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      <div className="flex flex-col w-full md:w-2/3">
        <div className="flex items-center justify-between p-2 md:p-3 border-b">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConversations(true)}
              className="md:hidden h-8 md:h-10 w-8 md:w-10"
            >
              <Building className="h-4 md:h-5 w-4 md:w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2 md:gap-3">
            <Avatar className="h-6 md:h-8 w-6 md:w-8">
              <AvatarImage
                src={activeConversation?.avatar || "/placeholder.svg"}
                alt={activeConversation?.name}
              />
              <AvatarFallback>
                <Building className="h-3 md:h-4 w-3 md:w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-xs">
                {activeConversation?.name}
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Request: Winter Clothes
              </p>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3">
            {/* Additional actions could go here */}
          </div>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 md:p-3 ${
                    message.isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-xs">{message.content}</p>
                  <span className="text-[10px] opacity-70 block text-right mt-1">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-2 md:p-3 border-t">
          <div className="flex gap-2 md:gap-3">
            <Input
              placeholder="Type a message..."
              className="h-8 md:h-10 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button
              size="icon"
              className="h-8 md:h-10 w-8 md:w-10"
              onClick={handleSendMessage}
            >
              <Send className="h-3 md:h-5 w-3 md:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
