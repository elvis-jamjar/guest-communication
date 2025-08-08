
'use client';

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    // Quote,
    // Code,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    MoreHorizontal,
    Link as LinkIcon,
    Unlink,
    Palette
} from 'lucide-react';
import { cn, isLink, normalizeUrl } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

interface RichTextEditorProps {
    content?: JSONContent | string;
    onChange?: (content: JSONContent) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
}

// Helper function to validate content structure
const isValidContentStructure = (content: unknown): boolean => {
    if (!content || typeof content !== 'object') {
        return false;
    }

    const contentObj = content as Record<string, unknown>;

    // Check if it has the required properties
    if (contentObj.type !== 'doc' || !Array.isArray(contentObj.content)) {
        return false;
    }

    // Recursively validate all nodes
    const validateNode = (node: unknown): boolean => {
        if (!node || typeof node !== 'object') {
            return false;
        }

        const nodeObj = node as Record<string, unknown>;

        // Check if node has a valid type
        if (typeof nodeObj.type !== 'string') {
            return false;
        }

        // Validate content array if present
        if (nodeObj.content !== undefined) {
            if (!Array.isArray(nodeObj.content)) {
                return false;
            }

            // Recursively validate all child nodes
            for (const childNode of nodeObj.content) {
                if (!validateNode(childNode)) {
                    return false;
                }
            }
        }

        return true;
    };

    // Validate all top-level content nodes
    for (const node of contentObj.content) {
        if (!validateNode(node)) {
            return false;
        }
    }

    return true;
};

// Helper function to normalize content structure from AI responses
const normalizeContentStructure = (content: unknown): JSONContent => {
    if (!content || typeof content !== 'object') {
        console.warn('Invalid content provided to normalizeContentStructure:', content);
        return {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: '' }]
                }
            ]
        };
    }

    // Recursively process content to fix node type names
    const processNode = (node: unknown): unknown => {
        if (!node || typeof node !== 'object') return node;

        // Fix common node type naming issues from AI responses
        const typeMapping: Record<string, string> = {
            'bullet_list': 'bulletList',
            'list_item': 'listItem',
            'ordered_list': 'orderedList'
        };

        const processedNode = { ...node as Record<string, unknown> };

        // Fix node type if needed
        if (processedNode.type && typeof processedNode.type === 'string') {
            if (typeMapping[processedNode.type]) {
                console.log(`Converting node type from '${processedNode.type}' to '${typeMapping[processedNode.type]}'`);
                processedNode.type = typeMapping[processedNode.type];
            }
        }

        // Process content array recursively
        if (Array.isArray(processedNode.content)) {
            processedNode.content = processedNode.content.map(processNode);
        }

        return processedNode;
    };

    try {
        const result = processNode(content) as JSONContent;
        console.log('Normalized content structure:', result);
        return result;
    } catch (error) {
        console.error('Error normalizing content structure:', error);
        // Return a safe fallback
        return {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Error loading content' }]
                }
            ]
        };
    }
};

const RichTextEditor = ({
    content,
    onChange,
    placeholder = "Start writing...",
    editable = false,
    className
}: RichTextEditorProps) => {
    const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
    const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ x: 0, y: 0 });
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const lastContentRef = useRef<string>('');
    const isExternalUpdateRef = useRef(false);
    const TEXT_COLORS: string[] = [
        '#000000', // Black
        '#ef4444', // Red 500
        '#f59e0b', // Amber 500
        '#10b981', // Emerald 500
        '#3b82f6', // Blue 500
        '#8b5cf6', // Violet 500
        '#ec4899', // Pink 500
        '#6b7280', // Gray 500
        '#111827', // Gray 900
        '#ffffff', // White
    ];
    // const [content, setContent] = useState<JSONContent | string>(typeof initialContent === 'string' ? JSON.parse(JSON.stringify(initialContent)) : initialContent || {
    //     type: 'doc',
    //     content: [
    //         {
    //             type: 'paragraph',
    //             content: [{ type: 'text', text: '' }]
    //         }
    //     ]
    // });



    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable the default heading, list, and link extensions from StarterKit
                // so we can configure them explicitly
                heading: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                link: false, // Disable the default link extension to avoid duplicates
            }),
            Typography,
            Placeholder.configure({
                placeholder,
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            // Explicitly configure heading extension
            Heading.configure({
                levels: [1, 2, 3],
            }),
            // Explicitly configure list extensions
            BulletList.configure({
                HTMLAttributes: {
                    class: 'tiptap-bullet-list',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'tiptap-ordered-list',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'tiptap-list-item',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-pink-500 underline cursor-pointer hover:text-pink-700',
                },
            }),
        ],
        content: typeof content === 'string' ? JSON.parse(JSON.stringify(content)) : content || {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: '',
                        },
                    ],
                },
            ],
        },
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (onChange && !isExternalUpdateRef.current) {
                onChange(editor.getJSON());
            }
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            const hasTextSelected = from !== to;

            if (hasTextSelected && editable && containerRef.current) {
                const { view } = editor;
                const { state } = view;
                const { selection } = state;

                // Get the coordinates of the selection relative to the viewport
                const coords = view.coordsAtPos(selection.from);
                const endCoords = view.coordsAtPos(selection.to);

                // Get the parent container's position and dimensions
                const containerRect = containerRef.current.getBoundingClientRect();

                // Calculate the center X position of the selection relative to the container
                const centerX = (coords.left + endCoords.right) / 2 - containerRect.left;

                // Toolbar dimensions
                const toolbarHeight = 50;

                // Calculate Y position - try to place above first, then below if not enough space
                const spaceAbove = coords.top - containerRect.top;

                let yPosition;
                if (spaceAbove >= toolbarHeight + 10) {
                    // Position above the selection
                    yPosition = coords.top - containerRect.top - toolbarHeight - 0;
                } else {
                    // Position below the selection
                    yPosition = endCoords.bottom - containerRect.top + 8;
                }

                setFloatingToolbarPosition({ x: centerX, y: yPosition });
                setShowFloatingToolbar(true);
            } else {
                setShowFloatingToolbar(false);
            }
        },
    });

    // Update editor's editable state when the prop changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    // Synchronize editor content when content prop changes
    useEffect(() => {
        if (editor && content) {
            const currentContent = editor.getJSON();
            const contentString = JSON.stringify(content);
            // Only update if the content is actually different to avoid infinite loops
            if (JSON.stringify(currentContent) !== contentString) {
                // Track the last content to prevent unnecessary updates
                if (lastContentRef.current !== contentString) {
                    lastContentRef.current = contentString;

                    // Mark this as an external update to prevent onUpdate callback
                    isExternalUpdateRef.current = true;

                    try {
                        // Normalize the content structure before setting it
                        const normalizedContent = normalizeContentStructure(content);

                        // Validate the normalized content
                        if (!isValidContentStructure(normalizedContent)) {
                            console.error('Invalid content structure after normalization:', normalizedContent);
                            throw new Error('Invalid content structure');
                        }

                        // Force a complete content replacement
                        editor.commands.setContent(normalizedContent);

                        // Ensure the editor is focused and cursor is at the end
                        if (editable) {
                            editor.commands.focus('end');
                        }
                    } catch (error) {
                        console.error('Error setting content:', error);
                        // Fallback to empty content if there's an error
                        editor.commands.setContent({
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [{ type: 'text', text: '' }]
                                }
                            ]
                        });
                    }

                    // Reset the flag after a short delay
                    setTimeout(() => {
                        isExternalUpdateRef.current = false;
                    }, 100);
                }
            }
        }
    }, [editor, content, editable]);

    // Only hide floating toolbar when clicking outside the editor
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only hide if clicking outside the editor and floating toolbar
            if (editor && event.target) {
                const editorElement = editor.view.dom;
                const floatingToolbar = document.querySelector('.floating-toolbar');

                if (!editorElement.contains(event.target as Node) &&
                    !floatingToolbar?.contains(event.target as Node)) {
                    setShowFloatingToolbar(false);
                }
            }
        };

        if (editor) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [editor]);

    const handleAddLink = () => {
        if (!editor) return;

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        // If text is selected, use it as link text
        if (selectedText) {
            if (isLink(selectedText)) {
                setLinkUrl(normalizeUrl(selectedText));
            } else {
                setLinkText(selectedText);
            }
        } else {
            setLinkText('');
            setLinkUrl('');
        }

        setShowLinkDialog(true);
    };


    const handleSaveLink = () => {
        if (!editor || !linkUrl.trim()) return;
        const _normalizedLinkUrl = normalizeUrl(linkUrl);
        const isValid = isLink(_normalizedLinkUrl)

        if (!isValid) {
            toast.error("Please enter a valid URL");
            return;
        }

        if (linkText.trim()) {

            // Replace selected text with link
            editor.chain().focus().insertContent({
                type: 'text',
                text: linkText,
                marks: [{ type: 'link', attrs: { href: _normalizedLinkUrl } }]
            }).run();
        } else {
            // Insert link at cursor position
            editor.chain().focus().setLink({ href: _normalizedLinkUrl }).run();
        }

        setShowLinkDialog(false);
        setLinkUrl('');
        setLinkText('');
    };

    const handleRemoveLink = () => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
    };

    const handleSetTextColor = (color: string) => {
        if (!editor) return;
        editor.chain().focus().setColor(color).run();
    };

    const handleClearTextColor = () => {
        if (!editor) return;
        editor.chain().focus().unsetColor().run();
    };

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive,
        disabled,
        children,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title?: string;
    }) => (
        <Button
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            disabled={disabled}
            title={title}
            className={cn(
                "size-6 p-0",
                isActive && "bg-primary text-primary-foreground"
            )}
        >
            {children}
        </Button>
    );

    const FloatingToolbar = () => {
        if (!showFloatingToolbar) return null;

        return (
            <div
                className="floating-toolbar absolute z-10 bg-background border border-border rounded-lg shadow-lg p-1 flex items-center gap-1 animate-in fade-in zoom-in-95 duration-500"
                style={{
                    left: `${floatingToolbarPosition.x}px`,
                    top: `${floatingToolbarPosition.y}px`,
                    transform: 'translateX(-50%)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <Underline className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Text Color */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="size-6 p-0"
                            title="Text color"
                        >
                            <Palette className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="p-2">
                        <div className="grid grid-cols-5 gap-2">
                            {TEXT_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleSetTextColor(c)}
                                    className="h-5 w-5 rounded-full border border-border"
                                    style={{ backgroundColor: c }}
                                    aria-label={`Set color ${c}`}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex justify-center">
                            <Button variant="ghost" size="sm" onClick={handleClearTextColor}>
                                Clear
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu> */}

                <ToolbarButton
                    onClick={handleAddLink}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>
                {editor.isActive('link') && (
                    <ToolbarButton
                        onClick={handleRemoveLink}
                        title="Remove Link"
                    >
                        <Unlink className="h-4 w-4" />
                    </ToolbarButton>
                )}


            </div>
        );
    };

    return (
        <div ref={containerRef} className={cn("w-full relative flex flex-col min-h-full", className)}>
            {editable && (
                <div className="border-b border-border pb-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Desktop: single row, Mobile: two rows */}
                    <div className="hidden md:flex items-center gap-1 flex-wrap">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo"
                        >
                            <Undo className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo"
                        >
                            <Redo className="h-4 w-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6" />

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold"
                        >
                            <Bold className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic"
                        >
                            <Italic className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title="Underline"
                        >
                            <Underline className="h-4 w-4 hidden md:block" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive('strike')}
                            title="Strikethrough"
                        >
                            <Strikethrough className="h-4 w-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />

                        {/* Text Color */}
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-6 p-0"
                                    title="Text color"
                                >
                                    <Palette className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="p-2">
                                <div className="grid grid-cols-10 gap-2">
                                    {TEXT_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => handleSetTextColor(c)}
                                            className="h-5 w-5 rounded-full border border-border"
                                            style={{ backgroundColor: c }}
                                            aria-label={`Set color ${c}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 flex justify-start">
                                    <Button variant="ghost" size="sm" onClick={handleClearTextColor}>
                                        Clear color
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> */}

                        <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />

                        <ToolbarButton
                            onClick={handleAddLink}
                            isActive={editor.isActive('link')}
                            title="Add Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </ToolbarButton>
                        {editor.isActive('link') && (
                            <ToolbarButton
                                onClick={handleRemoveLink}
                                title="Remove Link"
                            >
                                <Unlink className="h-4 w-4" />
                            </ToolbarButton>
                        )}

                        <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />

                        <ToolbarButton
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 1 }).run();
                            }}
                            isActive={editor.isActive('heading', { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 2 }).run();
                            }}
                            isActive={editor.isActive('heading', { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 3 }).run();
                            }}
                            isActive={editor.isActive('heading', { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 className="h-4 w-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />

                        <ToolbarButton
                            onClick={() => {
                                editor.chain().focus().toggleBulletList().run();
                            }}
                            isActive={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <List className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => {
                                editor.chain().focus().toggleOrderedList().run();
                            }}
                            isActive={editor.isActive('orderedList')}
                            title="Numbered List"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </ToolbarButton>

                        <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />

                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            isActive={editor.isActive({ textAlign: 'justify' })}
                            title="Justify"
                        >
                            <AlignJustify className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    {/* Mobile: first three groups visible + dropdown for rest */}
                    <div className="md:hidden">
                        <div className="flex items-center justify-between gap-1">
                            {/* Group 1: Undo/Redo */}
                            <div className="flex items-center gap-1">
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={!editor.can().undo()}
                                    title="Undo"
                                >
                                    <Undo className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={!editor.can().redo()}
                                    title="Redo"
                                >
                                    <Redo className="h-4 w-4" />
                                </ToolbarButton>
                            </div>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Group 2: Basic formatting */}
                            <div className="flex items-center gap-1">
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    isActive={editor.isActive('bold')}
                                    title="Bold"
                                >
                                    <Bold className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    isActive={editor.isActive('italic')}
                                    title="Italic"
                                >
                                    <Italic className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    isActive={editor.isActive('underline')}
                                    title="Underline"
                                >
                                    <Underline className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                    isActive={editor.isActive('strike')}
                                    title="Strikethrough"
                                >
                                    <Strikethrough className="h-4 w-4" />
                                </ToolbarButton>
                            </div>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Group 3: Lists */}
                            <div className="flex items-center gap-1">
                                <ToolbarButton
                                    onClick={() => {
                                        editor.chain().focus().toggleBulletList().run();
                                    }}
                                    isActive={editor.isActive('bulletList')}
                                    title="Bullet List"
                                >
                                    <List className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => {
                                        editor.chain().focus().toggleOrderedList().run();
                                    }}
                                    isActive={editor.isActive('orderedList')}
                                    title="Numbered List"
                                >
                                    <ListOrdered className="h-4 w-4" />
                                </ToolbarButton>
                            </div>

                            {/* Dropdown for remaining items */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="size-6 p-0"
                                        title="More options"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <div className="p-1">
                                        {/* Link */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <ToolbarButton
                                                onClick={handleAddLink}
                                                isActive={editor.isActive('link')}
                                                title="Add Link"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                            </ToolbarButton>
                                            {editor.isActive('link') && (
                                                <ToolbarButton
                                                    onClick={handleRemoveLink}
                                                    title="Remove Link"
                                                >
                                                    <Unlink className="h-4 w-4" />
                                                </ToolbarButton>
                                            )}
                                        </div>

                                        <DropdownMenuSeparator />

                                        {/* Text Color */}
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Text color</span>
                                                <Button variant="ghost" size="sm" onClick={handleClearTextColor}>
                                                    Clear
                                                </Button>
                                            </div>
                                            <div className="mt-2 grid grid-cols-8 gap-2">
                                                {TEXT_COLORS.map((c) => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => handleSetTextColor(c)}
                                                        className="h-5 w-5 rounded-full border border-border"
                                                        style={{ backgroundColor: c }}
                                                        aria-label={`Set color ${c}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Headers */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <ToolbarButton
                                                onClick={() => {
                                                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                                                }}
                                                isActive={editor.isActive('heading', { level: 1 })}
                                                title="Heading 1"
                                            >
                                                <Heading1 className="h-4 w-4" />
                                            </ToolbarButton>
                                            <ToolbarButton
                                                onClick={() => {
                                                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                                                }}
                                                isActive={editor.isActive('heading', { level: 2 })}
                                                title="Heading 2"
                                            >
                                                <Heading2 className="h-4 w-4" />
                                            </ToolbarButton>
                                            <ToolbarButton
                                                onClick={() => {
                                                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                                                }}
                                                isActive={editor.isActive('heading', { level: 3 })}
                                                title="Heading 3"
                                            >
                                                <Heading3 className="h-4 w-4" />
                                            </ToolbarButton>
                                        </div>

                                        <DropdownMenuSeparator />

                                        {/* Alignment */}
                                        <div className="flex items-center gap-1 mt-2">
                                            <ToolbarButton
                                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                                isActive={editor.isActive({ textAlign: 'left' })}
                                                title="Align Left"
                                            >
                                                <AlignLeft className="h-4 w-4" />
                                            </ToolbarButton>
                                            <ToolbarButton
                                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                                isActive={editor.isActive({ textAlign: 'center' })}
                                                title="Align Center"
                                            >
                                                <AlignCenter className="h-4 w-4" />
                                            </ToolbarButton>
                                            <ToolbarButton
                                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                                isActive={editor.isActive({ textAlign: 'right' })}
                                                title="Align Right"
                                            >
                                                <AlignRight className="h-4 w-4" />
                                            </ToolbarButton>
                                            <ToolbarButton
                                                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                                isActive={editor.isActive({ textAlign: 'justify' })}
                                                title="Justify"
                                            >
                                                <AlignJustify className="h-4 w-4" />
                                            </ToolbarButton>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full flex-1 flex flex-col min-h-0 relative">
                <EditorContent
                    editor={editor}
                    disabled={false}
                    autoFocus={true}
                    tabIndex={0}
                    className={cn(
                        "flex-1 h-full p-1 focus:outline-none overflow-y-auto no-scrollbar focus:ring-0 focus:border-transparent",
                        // Remove default browser focus ring on the inner ProseMirror editable element
                        "[&_.ProseMirror:focus]:outline-none [&_.ProseMirror:focus-visible]:outline-none",
                        "[&_.ProseMirror:focus]:ring-0 [&_.ProseMirror:focus-visible]:ring-0",
                        "[&_.ProseMirror:focus]:border-transparent [&_.ProseMirror:focus-visible]:border-transparent",
                        "[&_.ProseMirror]:leading-7",
                        "[&_.ProseMirror_p]:!my-1",
                        "[&_.ProseMirror_h1]:!my-2 [&_.ProseMirror_h1]:!leading-7",
                        "[&_.ProseMirror_h2]:!my-2 [&_.ProseMirror_h2]:!leading-7",
                        "[&_.ProseMirror_h3]:!my-1 [&_.ProseMirror_h3]:!leading-7",
                        "[&_.ProseMirror_ul]:!my-1 [&_.ProseMirror_ol]:!my-1",
                        "[&_.ProseMirror_li]:!my-0",
                        "[&_.ProseMirror_a]:!text-pink-500 [&_.ProseMirror_a]:!underline [&_.ProseMirror_a]:!cursor-pointer [&_.ProseMirror_a:hover]:!text-pink-700",
                        "[&_.ProseMirror_.ProseMirror-cursor]:!border-black",
                        !editable && "cursor-default select-text"
                    )}
                />
            </div>
            <FloatingToolbar />

            {/* Link Dialog */}
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Link</DialogTitle>
                        <DialogDescription>
                            Enter the URL and optional link text.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <div className="col-span-3 space-y-1">
                                <Input
                                    id="url"
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className={cn(
                                        linkUrl.trim() && !isLink(linkUrl) && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveLink();
                                        }
                                    }}
                                />
                                {linkUrl.trim() && !isLink(linkUrl) && (
                                    <p className="text-sm text-red-500">
                                        Please enter a valid URL (e.g., https://example.com)
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="text" className="text-right">
                                Text
                            </Label>
                            <Input
                                id="text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="Link text (optional)"
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveLink();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveLink} disabled={!isLink(linkUrl)}>
                            Add Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RichTextEditor;
