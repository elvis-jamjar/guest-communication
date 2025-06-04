"use client";
import { useEffect, useState, useRef } from 'react';
// import { verifyTurnstile } from "@/lib/verification/turnstile";
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Send, Loader2, MessageSquare, UserCircle, MessageCircle, Info, X, ChevronDown } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { getGreeting } from '@/utils/date';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';
// import Turnstile from "react-cloudflare-turnstile";

// interface ChatBotProps {
//     onHumanCheck?: (isHuman: boolean) => void;
// }

export const ChatBot = () => {
    // const [isHuman, setIsHuman] = useState(false);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    // const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isMobile = useMobile();


    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    const { handleSubmit, messages, status, setInput: setChatInput } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: '0',
                role: 'assistant',
                content: `**${getGreeting()}**, I'm **ACGC AI**, your personal assistant. How can I help you today?`
            }
        ],
        onFinish: () => {
            setIsSending(false);
        },

        onError: (error) => {
            if (error?.cause || error?.name) {
                toast.error(error.message || "Something went wrong");
                setIsSending(false);
                return;
            }
            const errorMessage = JSON.parse(error.message) as {
                name: string;
                message: string;
                status: number;
                cause: string;
            };
            toast.error(errorMessage.message || "Something went wrong");
            setIsSending(false);
        },
    });

    const isDisabled = Boolean(status === 'streaming' || !input.trim() || isSending);
    // Add ref for the scroll area
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (input.trim()) {
            setChatInput(input);
        }
    }, [input, setChatInput]);


    // const verifyHuman = useCallback(async () => {
    //     if (turnstileToken && !isHuman) {
    //         // verify the turnstile token
    //         const isVerified = await verifyTurnstile(turnstileToken);
    //         if (isVerified) {
    //             setIsHuman(true);
    //             onHumanCheck?.(true);
    //         }
    //     }
    // }, [turnstileToken, isHuman, onHumanCheck]);

    // useEffect(() => {
    //     verifyHuman();
    // }, [verifyHuman]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;
        try {
            // if (!isHuman) {
            //     toast.error("Please complete the verification");
            //     return;
            // }
            setIsSending(true);
            setChatInput(input);
            // remove the empty message
            handleSubmit(undefined, {
                allowEmptySubmit: false,
                body: {
                    prompt: input,
                    messages: messages,
                }
            });
            setInput('');
            // setTurnstileToken(null);
        } catch (err) {
            console.error("error", err);
            setIsSending(false);
        }
    };

    return (
        <motion.div
            className="max-w-3xl mx-auto mb-8 mr-8 fixed bottom-0 right-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <motion.div
                className="relative group"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm border pointer-events-none whitespace-nowrap">
                    Ask ACGC AI anything!
                </div>
                <ChevronDown className="h-4 w-4 absolute -top-5 left-1/2 -translate-x-1/2  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none " />
                {/* <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 rotate-45 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div> */}
                <Button
                    variant="default"
                    size="lg"
                    className="h-12 px-4 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <span className="font-medium">Ask ACGC</span>
                </Button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "80dvh", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed bottom-0 right-0 w-full md:w-[400px] bg-background border-t border-l border-r rounded-t-xl rounded-b-lg shadow-lg overflow-hidden"
                    >
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="text-lg font-semibold">ACGC AI</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-muted"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <ScrollArea viewportRef={scrollAreaRef} className="flex-1 px-4 h-[calc(80dvh-10rem)]">
                                <div className="space-y-6 py-4 pb-24">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Info className="h-4 w-4" />
                                        <p>Note: Conversations are not stored. Please stay on this page to continue your chat.</p>
                                    </div>
                                    {messages?.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`p-4 rounded-xl prose shadow-none w-fit max-w-[85%] ${message.role === 'assistant'
                                                ? 'bg-muted/80 border border-border/50'
                                                : 'bg-primary/20 border border-primary/20 ml-auto'
                                                }`}
                                        >
                                            <h3 className="font-medium mb-2 text-sm text-foreground/80 flex items-center gap-2">
                                                {message.role === 'assistant' ? (
                                                    <>
                                                        <MessageCircle className="h-4 w-4" />
                                                        ACGC AI
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCircle className="h-4 w-4 text-primary" />
                                                        You
                                                    </>
                                                )}
                                            </h3>
                                            {message.role === 'assistant' ? (
                                                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold">
                                                    <Markdown
                                                        components={{
                                                            a: ({ children, href }) => (
                                                                <a href={href} target="_blank" rel="noopener noreferrer">
                                                                    {children}
                                                                </a>
                                                            )
                                                        }}
                                                    >{message.content as string}</Markdown>
                                                </div>
                                            ) : (
                                                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{message.content as string}</p>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
                                <form onSubmit={onSubmit} className="flex flex-col gap-2">
                                    <div className="relative flex flex-row items-center gap-0 rounded-lg">
                                        <Textarea
                                            ref={textareaRef}
                                            id="chat-input"
                                            placeholder="Type question..."
                                            value={input}
                                            onInput={(e) => {
                                                setInput(e.currentTarget.value);
                                                adjustTextareaHeight();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (input.trim()) {
                                                        onSubmit(e);
                                                    }
                                                }
                                            }}
                                            className="pt-2 flex-1 min-h-[30px] w-full h-auto placeholder:text-sm resize-none max-h-[200px] overflow-y-auto outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-gray-200/50 border border-primary"
                                            rows={1}
                                            disabled={status === 'streaming'}
                                            enterKeyHint="send"
                                            inputMode="text"
                                            tabIndex={0}
                                            maxLength={200}
                                        />
                                        <Button
                                            type="submit"
                                            variant={isDisabled ? "outline" : "default"}
                                            disabled={isDisabled}
                                            className="self-end hover:text-primary hover:bg-primary/90 size-9 p-0 m-0.5"
                                        >
                                            {isSending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-center flex items-center justify-start gap-1">
                                        <kbd className="px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded-md border">⇧</kbd>
                                        <span>+</span>
                                        <kbd className="px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted rounded-md border">↵</kbd>
                                        <span>= next line</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}