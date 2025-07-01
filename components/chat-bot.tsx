"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageSquare, X, ChevronDown, StopCircle, ExternalLink, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { formatTime, getGreeting } from '@/utils/date';
import { toast } from 'sonner';
import { ChatBotStateUpdate } from './chat-bot-state-update';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useChatBotStore } from '@/lib/store';
// import { useKeyboardStatus } from '@/hooks/use-keyboad';
import { useMobile } from '@/hooks/use-mobile';
import { ChatBotQuestionSuggestions } from './chat-bot-question-suggestions';



const RenderMessage = ({ message }: { message: string }) => {
    return (
        <Markdown
            components={{
                a: ({ children, href }) => (
                    <a href={href} target={href?.includes("#") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="text-primary-main w-fit flex items-center gap-1 border border-primary-main rounded-lg px-2 py-1 font-medium no-underline hover:bg-primary/10 hover:text-primary-main"
                    >
                        {children} <ExternalLink className="h-4 w-4" />
                    </a>
                ),
                img: ({ src, alt }) => (
                    <Image
                        src={src as string} alt={alt || ''}
                        width={200} height={200}
                        priority
                        loading="eager"
                        className="w-full h-auto object-contain" />
                )
            }}
        >
            {message}
        </Markdown>
    )
}


export const PopOverChat = () => {
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isOpen, toggleIsOpen } = useChatBotStore();
    const isMobile = useMobile();
    // const isKeyboardOpen = useKeyboardStatus();

    const { handleSubmit, messages, handleInputChange, status, setInput: setChatInput, input, stop } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: '0',
                role: 'assistant',
                content: `**${getGreeting()}**, I'm **ACGC AI**, your personal assistant. How can I help you today?`,
            }
        ],
        onFinish: () => {
            setIsSending(false);
            if (!isMobile) {
                setTimeout(() => {
                    textareaRef.current?.focus();
                }, 500);
            }
        },
        onError: (error) => {
            setIsSending(false);
            if (error?.cause || error?.name) {
                toast.error(error.message || "Something went wrong");
                return;
            }
            const errorMessage = JSON.parse(error.message) as {
                name: string;
                message: string;
                status: number;
                cause: string;
            };
            toast.error(errorMessage.message || "Something went wrong");
        },
    });

    const isStreaming = status === 'streaming' || isSending;
    const isDisabled = !input.trim() || isStreaming;
    // Add ref for the scroll area
    const scrollAreaRef = useRef<HTMLDivElement>(null);


    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set the height to scrollHeight to fit content
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Adjust height on input change
        const handleInput = () => {
            adjustTextareaHeight();
        };

        textarea.addEventListener('input', handleInput);
        const resizeObserver = new ResizeObserver(adjustTextareaHeight);
        resizeObserver.observe(textarea);

        return () => {
            textarea.removeEventListener('input', handleInput);
            resizeObserver.disconnect();
        };
    }, [adjustTextareaHeight]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages.length]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        try {
            setIsSending(true);
            handleSubmit(undefined, {
                allowEmptySubmit: false,
                body: {
                    prompt: input,
                    messages: messages,
                }
            });
            setChatInput('');
        } catch (err) {
            console.error("error", err);
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow Shift+Enter for new lines
                return;
            }
            e.preventDefault();
            onSubmit(e);
        }
    };

    const handleStop = () => {
        if (isStreaming) {
            stop();
            setIsSending(false);
        }
    }

    return (
        <>
            <motion.div
                className="fixed bottom-4 right-4 w-auto z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}>
                <motion.div
                    className="relative group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {!isOpen && <div className="absolute -top-14 right-8 translate-x-1/2 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm border pointer-events-none whitespace-nowrap">
                        Ask ACGC
                    </div>}
                    {!isOpen && <ChevronDown className="h-4 w-4 absolute -top-5 right-6 translate-x-1/2  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none " />}

                    <Button
                        variant="default"
                        size="lg"
                        className="size-12 px-4 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={toggleIsOpen}
                    >
                        {isOpen ? (
                            <X className="h-5 w-5 transition-all duration-300 ease-in-out rotate-0" />
                        ) : (
                            <MessageSquare className="h-5 w-5 transition-all duration-300 ease-in-out" />
                        )}
                        <span className="sr-only"> {isOpen ? "Close" : "Open"} Chat</span>
                    </Button>
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, width: 0 }}
                        animate={{ height: isMobile ? "100dvh" : "80dvh", opacity: 1, width: isMobile ? "100dvw" : "auto" }}
                        exit={{ height: 0, opacity: 0, width: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={cn(
                            "fixed z-50 bg-background border-t border-l border-r rounded-t-xl rounded-b-lg shadow-lg overflow-hidden flex flex-col",
                            "w-full h-[100dvh] bottom-0 right-0 md:bottom-20  md:h-[80dvh] md:min-w-[20rem] md:max-w-3xl md:left-auto md:right-5 md:rounded-b-lg",
                            // isKeyboardOpen && "bottom-[50vh]"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b bg-background/95">
                            <div className="relative flex items-center">
                                <Image src="/images/logo.png" alt="ACGC Logo" width={60} height={60} className="rounded-sm bg-white border" />
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 animate-pulse border-2 border-background rounded-full" title="Online"></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-base leading-tight">Assistant</span>
                                <ChatBotQuestionSuggestions />
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={toggleIsOpen}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Messages */}
                        <ScrollArea viewportRef={scrollAreaRef} className="flex-1 px-4 h-[calc(80dvh-12rem)] bg-background">
                            <div className="space-y-4 py-4 pb-24">
                                {messages?.map((message, index) => {
                                    let schedule = null;
                                    const parts = message.parts
                                    if (parts) {
                                        parts.forEach(part => {
                                            if (part.type === 'tool-invocation') {
                                                schedule = part.toolInvocation.state === 'result' ? part.toolInvocation.result : null;
                                            }
                                        });
                                    }
                                    return (
                                        <div key={index} className={`flex w-full ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                            {message.role === 'assistant' && (
                                                <div className="flex flex-col items-center mr-1.5">
                                                    <div className="relative">
                                                        <Image src="/images/logo.png" alt="ACGC Logo" width={30} height={30} className="rounded-sm bg-white border" />
                                                        {isStreaming && index === messages.length - 1 && (
                                                            <div className="absolute -right-1 -bottom-1 bg-background rounded-full p-0.5">
                                                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col w-full">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-none ${message.role === 'assistant' ? 'bg-muted/80 border border-border/50 text-foreground rounded-tl-none' : 'bg-primary/70 text-white ml-auto rounded-br-none'} flex flex-col`}>
                                                    {message.role === 'assistant' ? (
                                                        <div className="w-full prose max-w-none">
                                                            {(isStreaming && index === messages.length - 1) ? <ChatBotStateUpdate /> : ''}
                                                            <RenderMessage message={message.content as string} />
                                                            {schedule && <RenderMessage message={schedule} />}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm min-w-full mr-2 self-start text-left w-full">{message.content as string}</span>
                                                    )}
                                                </motion.div>
                                                <span className={cn("text-xs mx-2 font-medium text-muted-foreground mt-1", message.role === 'assistant' ? 'text-left' : 'text-right')}>{formatTime(message.createdAt)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* Show AI avatar with loading when starting a new response */}
                                {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                                    <div className="flex w-full justify-start">
                                        <div className="flex flex-col items-center mr-1.5">
                                            <div className="relative">
                                                <Image src="/images/logo.png" alt="ACGC Logo" width={30} height={30} className="rounded-sm bg-white border" />
                                                <div className="absolute -right-1 -bottom-1 bg-background rounded-full p-0.5">
                                                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="rounded-2xl px-4 py-2 max-w-[80%] shadow-none bg-muted/80 border border-border/50 text-foreground rounded-tl-none flex flex-col">
                                                <div className="w-full prose max-w-none">
                                                    <ChatBotStateUpdate />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        {/* Input */}
                        <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
                            <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
                                <div className="flex flex-row w-full flex-1 h-auto">
                                    <textarea
                                        ref={textareaRef}
                                        id="chat-input"
                                        placeholder={isStreaming ? "Waiting for response..." : "Ask me anything"}
                                        value={input}
                                        rows={1}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="w-full max-h-16 md:max-h-20 no-scrollbar rounded-sm border resize-none border-primary-main bg-gray-200/50 p-2 text-sm shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isStreaming}
                                        maxLength={200}
                                    />
                                    <Button
                                        type={isStreaming ? "button" : "submit"}
                                        variant={"ghost"}
                                        disabled={isDisabled}
                                        className="size-8 p-0 text-primary-main rounded-full flex self-end items-center justify-center shadow-none disabled:opacity-50"
                                        onClick={isStreaming ? handleStop : undefined}
                                    >
                                        {isStreaming ? (
                                            <StopCircle className="h-4 w-4" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}