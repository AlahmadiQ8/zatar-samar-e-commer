import { ComponentProps } from "react"
import { X } from "@phosphor-icons/react"

const SheetTrigger = SheetPrimit

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

      {...props}
  )

  side = "right",
  children
}: ComponentProps<typeof Sh
      className={cn(
    <SheetPortal>
      <SheetPrimi
        
            "ins
      
   
 

        <SheetPrimitive
          <span c
      </Shee
  )

  className,
}: ComponentProps<"div">) {
    
        "f
      )}
    />
}
function SheetFooter({
  ...props
  return (
      className={cn(
        className
      {...props}
  )

  className,
}: Compone
    <SheetPrimitiv
      {
  )

  className,
}: ComponentProps<typeof SheetPrimitive.Descript
    <SheetPrimitive.Description
      {...props}
  )

 

  SheetClose,
  SheetHeade
  SheetTit
}


















        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}
























