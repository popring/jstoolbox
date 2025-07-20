/**
 * Button Component Variants
 * 
 * Available variants:
 * - default: Primary button with primary colors
 * - destructive: Red button for destructive actions
 * - outline: Bordered button with background
 * - secondary: Secondary button with muted colors
 * - ghost: Transparent button with hover effects
 * - link: Text button that looks like a link
 * - dark: Dark theme button with zinc-900 background and yellow hover
 * - darkDeeper: Deeper dark theme button with zinc-1000 background
 * - yellow: Yellow highlight button for active states
 * - ghostDark: Dark ghost button with zinc colors and yellow hover
 * 
 * Usage:
 * <Button variant="dark" size="sm">Dark Button</Button>
 * <Button variant="yellow" size="sm">Active Button</Button>
 * <Button variant="darkDeeper" size="sm">Deep Dark Button</Button>
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-zinc-800/50 hover:text-zinc-200",
        link: "text-primary underline-offset-4 hover:underline",
        // 新增暗色主题变体
        dark: "bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400",
        // 新增更深的暗色变体
        darkDeeper: "bg-zinc-1000 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400",
        // 新增黄色高亮变体
        yellow: "bg-yellow-500 text-black hover:bg-yellow-400",
        // 新增暗色幽灵变体
        ghostDark: "text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
