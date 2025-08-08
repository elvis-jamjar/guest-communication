"use client"

import React from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button, type ButtonProps } from "@/components/ui/button"

type ConfirmationProps = {
    trigger: React.ReactNode
    onConfirm: () => Promise<void> | void
    title?: React.ReactNode
    description?: React.ReactNode
    confirmText?: string
    cancelText?: string
    confirmVariant?: ButtonProps["variant"]
    open?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
}

export function Confirmation({
    trigger,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "destructive",
    open: controlledOpen,
    onOpenChange,
    disabled = false,
}: ConfirmationProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const isControlled = typeof controlledOpen === "boolean"
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const handleOpenChange = (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next)
        onOpenChange?.(next)
    }

    const [isConfirming, setIsConfirming] = React.useState(false)

    const handleConfirm = async () => {
        try {
            setIsConfirming(true)
            await onConfirm()
            handleOpenChange(false)
        } catch (_) {
            // Keep dialog open on error; surface handling is up to caller
        } finally {
            setIsConfirming(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <span aria-disabled={disabled} className={disabled ? "pointer-events-none opacity-60" : undefined}>
                    {trigger}
                </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {title ? <DialogTitle>{title}</DialogTitle> : null}
                    {description ? (
                        <DialogDescription>{description}</DialogDescription>
                    ) : null}
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isConfirming}>
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? `${confirmText}...` : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Confirmation


