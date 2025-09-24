"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUpRightIcon, Eye, Plus, Save, Send, Trash2, X, Clock, Calendar } from "lucide-react";
import { Notification, NotificationLink } from "@/app/types";
import { toast } from "sonner";

interface NotificationFormProps {
    onSave: (notification: Omit<Notification, 'id' | 'timestamp' | 'impressions' | 'uniqueRecipients' | 'recipientIPs'>) => Promise<Notification>;
    onPublish: (notificationId: string, targetAudience: string) => Promise<void>;
    initialData?: Partial<Notification>;
    isEditing?: boolean;
    onCancel?: () => void;
    onSuccess?: () => void; // Callback for successful operations
}

export default function NotificationForm({
    onSave,
    onPublish,
    initialData,
    isEditing = false,
    onCancel,
    onSuccess
}: NotificationFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        message: initialData?.message || "",
        priority: initialData?.priority || "medium",
        status: initialData?.status || "draft",
        targetAudience: initialData?.targetAudience || "all",
        expiresAt: initialData?.expiresAt || "",
        scheduledFor: initialData?.scheduledFor || "",
        isScheduled: initialData?.isScheduled || false,
        links: initialData?.links || [] as NotificationLink[]
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [newLink, setNewLink] = useState({ label: "", url: "" });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: "",
            message: "",
            priority: "medium",
            status: "draft",
            targetAudience: "all",
            expiresAt: "",
            scheduledFor: "",
            isScheduled: false,
            links: []
        });
        setNewLink({ label: "", url: "" });
        setValidationErrors({});
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear validation errors for this field
        setValidationErrors(prev => ({ ...prev, [field]: "" }));

        // Real-time validation for date fields
        if (field === 'expiresAt' || field === 'scheduledFor' || field === 'isScheduled') {
            const now = new Date();
            const newFormData = { ...formData, [field]: value };
            const errors: { [key: string]: string } = {};

            // Validate expiration date
            if (newFormData.expiresAt) {
                const expirationTime = new Date(newFormData.expiresAt);
                if (expirationTime <= now) {
                    errors.expiresAt = "Expiration date must be in the future";
                }
            }

            // Validate scheduled date
            if (newFormData.isScheduled && newFormData.scheduledFor) {
                const scheduledTime = new Date(newFormData.scheduledFor);
                if (scheduledTime <= now) {
                    errors.scheduledFor = "Scheduled time must be in the future";
                }
            }

            // Validate that expiration is after scheduled time
            if (newFormData.expiresAt && newFormData.isScheduled && newFormData.scheduledFor) {
                const expirationTime = new Date(newFormData.expiresAt);
                const scheduledTime = new Date(newFormData.scheduledFor);
                if (expirationTime <= scheduledTime) {
                    errors.expiresAt = "Expiration date must be after the scheduled time";
                }
            }

            // Update validation errors
            if (Object.keys(errors).length > 0) {
                setValidationErrors(prev => ({ ...prev, ...errors }));
            }
        }
    };

    const handleAddLink = () => {
        if (newLink.label && newLink.url) {
            setFormData(prev => ({
                ...prev,
                links: [...prev.links, { ...newLink }]
            }));
            setNewLink({ label: "", url: "" });
        }
    };

    const handleRemoveLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    // Validation function for dates
    const validateDates = () => {
        const now = new Date();
        const errors: string[] = [];

        // Validate expiration date
        if (formData.expiresAt) {
            const expirationTime = new Date(formData.expiresAt);
            if (expirationTime <= now) {
                errors.push("Expiration date must be in the future");
            }
        }

        // Validate scheduled date
        if (formData.isScheduled) {
            if (!formData.scheduledFor) {
                errors.push("Please select a schedule date and time");
            } else {
                const scheduledTime = new Date(formData.scheduledFor);
                if (scheduledTime <= now) {
                    errors.push("Scheduled time must be in the future");
                }
            }
        }

        // Validate that expiration is after scheduled time
        if (formData.expiresAt && formData.isScheduled && formData.scheduledFor) {
            const expirationTime = new Date(formData.expiresAt);
            const scheduledTime = new Date(formData.scheduledFor);
            if (expirationTime <= scheduledTime) {
                errors.push("Expiration date must be after the scheduled time");
            }
        }

        return errors;
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Title and message are required");
            return;
        }

        // Validate dates
        const dateErrors = validateDates();
        if (dateErrors.length > 0) {
            toast.error(dateErrors[0]);
            return;
        }

        setIsSaving(true);
        try {
            const savedNotification = await onSave(formData);
            toast.success(isEditing ? "Notification updated successfully" : "Notification saved successfully");
            resetForm();
            onSuccess?.();
            return savedNotification;
        } catch (error) {
            toast.error("Failed to save notification");
            console.error(error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!formData.title.trim() || !formData.message.trim()) {
            toast.error("Title and message are required");
            return;
        }

        // Validate dates
        const dateErrors = validateDates();
        if (dateErrors.length > 0) {
            toast.error(dateErrors[0]);
            return;
        }

        setIsPublishing(true);
        try {
            let notificationId = initialData?.id;
            console.log("Starting publish process:", { isEditing, notificationId, formData });

            // First save if it's a new notification
            if (!isEditing) {
                console.log("Saving new notification first...");
                const savedNotification = await onSave(formData);
                console.log("Saved notification:", savedNotification);
                // Extract the ID from the saved notification response
                notificationId = savedNotification?.id || notificationId;
            }

            console.log("Publishing with notification ID:", notificationId);
            // Then publish using the correct notification ID
            if (notificationId) {
                await onPublish(notificationId, formData.targetAudience);
                if (formData.isScheduled) {
                    toast.success(`Notification scheduled for ${new Date(formData.scheduledFor).toLocaleString()}`);
                } else {
                    toast.success("Notification published successfully");
                }
                resetForm();
                onSuccess?.();
            } else {
                throw new Error("No notification ID available for publishing");
            }
        } catch (error) {
            toast.error("Failed to publish notification");
            console.error("Publish error:", error);
        } finally {
            setIsPublishing(false);
        }
    };

    const previewNotification: Notification = {
        id: "preview",
        title: formData.title || "Preview Title",
        message: formData.message || "Preview message will appear here...",
        links: formData.links,
        timestamp: new Date().toISOString(),
        priority: formData.priority as "low" | "medium" | "high",
        isPreview: true,
        status: formData.isScheduled ? "scheduled" : "draft",
        targetAudience: formData.targetAudience as "all" | "preview" | "public",
        isScheduled: formData.isScheduled,
        scheduledFor: formData.scheduledFor
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {isEditing ? "Edit Notification" : "Create New Notification"}
                                {onCancel && (
                                    <Button variant="outline" size="sm" onClick={onCancel}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="Enter notification title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message *</Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    placeholder="Enter notification message"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="targetAudience">Target Audience</Label>
                                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange("targetAudience", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            <SelectItem value="preview">Preview Only</SelectItem>
                                            <SelectItem value="public">Public Users</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                                <Input
                                    id="expiresAt"
                                    type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                                    className={validationErrors.expiresAt ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {validationErrors.expiresAt && (
                                    <p className="text-sm text-red-500">{validationErrors.expiresAt}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scheduling Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary-purple" />
                                Schedule Notification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isScheduled"
                                    checked={formData.isScheduled}
                                    onCheckedChange={(checked) => handleInputChange("isScheduled", checked)}
                                />
                                <Label htmlFor="isScheduled">Schedule for later</Label>
                            </div>

                            {formData.isScheduled && (
                                <div className="space-y-2">
                                    <Label htmlFor="scheduledFor">Schedule Date & Time</Label>
                                    <Input
                                        id="scheduledFor"
                                        type="datetime-local"
                                        value={formData.scheduledFor}
                                        onChange={(e) => handleInputChange("scheduledFor", e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className={validationErrors.scheduledFor ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {validationErrors.scheduledFor ? (
                                        <p className="text-sm text-red-500">{validationErrors.scheduledFor}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            The notification will be automatically published at the scheduled time.
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Links Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Action Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.links.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Input
                                            value={link.label}
                                            onChange={(e) => {
                                                const newLinks = [...formData.links];
                                                newLinks[index] = { ...link, label: e.target.value };
                                                handleInputChange("links", newLinks);
                                            }}
                                            placeholder="Link label"
                                        />
                                        <Input
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...formData.links];
                                                newLinks[index] = { ...link, url: e.target.value };
                                                handleInputChange("links", newLinks);
                                            }}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveLink(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <Input
                                        value={newLink.label}
                                        onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                                        placeholder="Link label"
                                    />
                                    <Input
                                        value={newLink.url}
                                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddLink}
                                    disabled={!newLink.label || !newLink.url}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !formData.title.trim() || !formData.message.trim()}
                                    className="bg-primary-main text-white"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? "Saving..." : "Save Draft"}
                                </Button>

                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishing || !formData.title.trim() || !formData.message.trim()}
                                    className="bg-primary-purple text-white"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {isPublishing ? "Publishing..." : "Publish Now"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Live Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative text-white rounded-xl shadow-lg p-4 bg-black">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold line-clamp-1 text-base">{previewNotification.title}</h3>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-sm text-white">
                                        {previewNotification.message}
                                    </p>
                                </div>

                                {/* Render notification links as buttons */}
                                {previewNotification.links && previewNotification.links.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {previewNotification.links.map((link, linkIndex) => (
                                            <a
                                                key={linkIndex}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-primary-main flex-1 flex items-center justify-center gap-2 text-white group px-3 py-2 rounded-lg text-xs transition-colors hover:bg-primary-main/80"
                                            >
                                                {link.label}
                                                <ArrowUpRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Notification metadata */}
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>{new Date(previewNotification.timestamp).toLocaleTimeString()}</span>
                                    {previewNotification.priority && (
                                        <span className={`px-2 py-1 capitalize rounded text-xs ${previewNotification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                            previewNotification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {previewNotification.priority} Priority
                                        </span>
                                    )}
                                </div>

                                {/* Preview-specific info */}
                                <div className="mt-2 text-xs text-gray-500">
                                    <div className="flex justify-between items-center">
                                        <span>Preview Mode</span>
                                        <span>Target: {previewNotification.targetAudience}</span>
                                    </div>

                                    {previewNotification.isScheduled && previewNotification.scheduledFor && (
                                        <div className="mt-1 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>Scheduled for: {new Date(previewNotification.scheduledFor).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}