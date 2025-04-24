'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type DialogConfirmProps = {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description?: string
    action: () => void | Promise<void>
    confirmText?: string
    cancelText?: string
    loading?: boolean
}

export function DialogConfirm({
    open,
    setOpen,
    title,
    description,
    action,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
}: DialogConfirmProps) {
    const handleConfirm = async () => {
        await action()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {cancelText}
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
