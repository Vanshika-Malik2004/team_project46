import * as AccordionPrimitive from "@radix-ui/react-accordion"
import {
  ChevronDownIcon,
  Image,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import StepperComponent from "../comp-528"

export default function AccordionComponent({items, content}) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Look how far you have come</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2 px-6">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                <span className="flex items-center gap-3">
                   <span
                    className="flex size-20 shrink-0 items-center justify-center rounded-full border overflow-hidden"
                    aria-hidden="true"
                  >
                    {/* Properly fitted Image */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="flex flex-col space-y-1">
                    <span className="text-xl">{item.name}</span>
                    {item.sub && (
                      <span className="text-sm font-normal">{item.sub}</span>
                    )}
                  </span>
                </span>
                <ChevronDownIcon
                  size={30}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
              <StepperComponent/>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
