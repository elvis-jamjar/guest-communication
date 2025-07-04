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



const TypingIndicator = () => {
    return (
        <div className="flex items-center gap-1 px-2 py-1">
            <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                }}
            />
            <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            />
            <motion.div
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                }}
            />
        </div>
    );
};

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

    const { handleSubmit, messages, handleInputChange, status, setInput: setChatInput, input, stop, isLoading } = useChat({
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isLoading) {
                // Stop the current stream if loading and mark it as stopped
                stop();
            } else if (input.trim()) {
                // Clear stopped state when sending new message
                // Submit the form if not loading and input is not empty
                const form = e.currentTarget.form;
                if (form) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(submitEvent);
                }
            }
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
                className="fixed hidden bottom-4 right-4 w-auto z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}>
                <motion.div
                    className="relative group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {/* Enhanced tooltip with more content */}
                    {!isOpen && (
                        <div className="absolute -top-20 right-8 translate-x-1/2 bg-gradient-to-r from-primary/95 to-primary/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-primary/20 pointer-events-none whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Ask ACGC AI</span>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/95"></div>
                        </div>
                    )}

                    {/* Animated background ring */}
                    {!isOpen && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}

                    {/* Pulse ring effect */}
                    {!isOpen && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary-main/30"
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [1, 0, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}

                    <Button
                        variant="default"
                        size="lg"
                        className="relative size-14 px-4 rounded-full bg-gradient-to-r from-primary-main via-primary-main/95 to-primary-main/90 hover:from-primary-main/90 hover:via-primary-main hover:to-primary-main shadow-2xl hover:shadow-primary-main/25 transition-all duration-300 border-2 border-white/20"
                        onClick={toggleIsOpen}
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 transition-all duration-300 ease-in-out rotate-0" />
                        ) : (
                            <MessageSquare className="h-6 w-6 transition-all duration-300 ease-in-out" />
                        )}
                        <span className="sr-only"> {isOpen ? "Close" : "Open"} Chat</span>
                    </Button>

                    {/* Floating notification dot */}
                    {!isOpen && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-primary-purple rounded-full border-2 border-white"
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}
                </motion.div>
            </motion.div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: isMobile ? "100dvh" : "80dvh", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={cn(
                            "fixed z-50 bg-background border-t border-l border-r rounded-t-xl rounded-b-lg shadow-lg overflow-hidden flex flex-col",
                            "w-full h-[100dvh] bottom-0 right-0 md:bottom-20 md:h-[80dvh] md:min-w-[20rem] md:max-w-3xl md:left-auto md:right-5 md:rounded-b-lg",
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
                                                        <Image src="/images/logo.png" alt="ACGC Logo" width={40} height={40} className="rounded-sm bg-white border" />
                                                        {/* {(isStreaming || isLoading) && index === messages.length - 1 && (
                                                            <div className="absolute -right-1 -bottom-1 bg-background rounded-full p-0.5">
                                                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            )}
                                            {(message.content || schedule) && <div className="flex flex-col w-full">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={cn(`rounded-2xl px-4 py-2 shadow-none max-w-[80%] ${message.role === 'assistant' ? 'bg-muted/80 border border-border/50 text-foreground rounded-tl-none' : 'bg-primary/70 text-white ml-auto rounded-br-none'} flex flex-col`)}>
                                                    {message.role === 'assistant' ? (
                                                        <div className="w-full prose max-w-none">
                                                            <RenderMessage message={message.content as string} />
                                                            {schedule && <RenderMessage message={schedule} />}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm min-w-full mr-2 self-start text-left w-full">{message.content as string}</span>
                                                    )}
                                                </motion.div>
                                                <span className={cn("text-xs mx-2 font-medium text-muted-foreground mt-1", message.role === 'assistant' ? 'text-left' : 'text-right')}>{formatTime(message.createdAt)}</span>
                                            </div>}
                                        </div>
                                    )
                                })}

                                {/* Typing indicator when AI is responding */}
                                {(isStreaming || isLoading) && (
                                    <div className="flex w-full justify-start">
                                        <div className="flex flex-col items-center mr-1.5">
                                            <div className="relative">
                                                <Image src="/images/logo.png" alt="ACGC Logo" width={40} height={40} className="rounded-sm bg-white border" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="rounded-2xl px-4 py-3 max-w-[80%] bg-muted/80 border border-border/50 text-foreground rounded-tl-none shadow-none flex flex-col"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">ACGC AI is typing</span>
                                                    <TypingIndicator />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        {/* Input */}
                        <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
                            <form onSubmit={(e) => {
                                e.preventDefault();

                                if (!input.trim() || isLoading) return;
                                // Call the original handleSubmit
                                handleSubmit(e);
                            }} className="flex w-full items-center gap-2">
                                <div className="flex flex-row w-full flex-1 h-auto">
                                    <textarea
                                        ref={textareaRef}
                                        id="chat-input"
                                        placeholder={isStreaming ? "Waiting for response..." : "Ask me anything"}
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        className="w-full max-h-16 md:max-h-20 no-scrollbar rounded-sm text-base md:text-base border resize-none border-primary-main bg-gray-200/50 p-2 shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isStreaming}
                                        maxLength={200}
                                        enterKeyHint="send"
                                    />
                                    <Button
                                        type={isStreaming ? "button" : "submit"}
                                        variant={isDisabled ? "ghost" : "default"}
                                        disabled={isDisabled}
                                        className="size-12 p-2 bg-primary-purple ml-1 text-primary-main rounded-sm flex self-end items-center justify-center shadow-none disabled:opacity-50"
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