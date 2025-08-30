"use client"

import * as React from "react"
import { X, ArrowRight, ExternalLink, HelpCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export interface WelcomeModalProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  title: React.ReactNode
  description: string
  mainActionText: string
  onMainActionClick: () => void
  showDontShowAgain?: boolean
  helpLink?: string
}

const WelcomeModal = ({
  title,
  description,
  mainActionText,
  onMainActionClick,
  showDontShowAgain = true,
  helpLink = "#",
  children,
  ...props
}: WelcomeModalProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="w-full sm:max-w-xl rounded-2xl bg-background p-0 shadow-2xl border-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        {/* Main content area with responsive padding */}
        <div className="p-6 sm:p-8 pb-0">
            <DialogHeader>
              {/* Responsive title font size */}
              <DialogTitle className="flex items-center text-xl sm:text-2xl font-bold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-1 text-base">
                {description}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6 text-foreground">
                {children}
            </div>
        </div>

        {/* Footer area with responsive padding */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            {/* Responsive action bar */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center w-full gap-4 sm:gap-2">
                {showDontShowAgain && (
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dont-show-again" className="rounded-[4px]"/>
                        <label
                            htmlFor="dont-show-again"
                            className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Don't show again
                        </label>
                    </div>
                )}
               <div className="sm:flex-grow"></div>
                <Button size="lg" onClick={onMainActionClick} className="font-semibold w-full sm:w-auto">
                    {mainActionText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
WelcomeModal.displayName = "WelcomeModal"

export { WelcomeModal }
