import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import StepperComponent from "../stepper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SeverityChart } from "../severity-chart";

interface ProgressStep {
  severity: string;
  imgUrl: string;
  createdAt: string;
  id: string;
}

interface DiseaseItem {
  id: string;
  name: string;
  sub?: string;
  progress: ProgressStep[];
}

interface AccordionComponentProps {
  items: DiseaseItem[];
  fetchDiseases: () => void;
}

const AccordionComponent = ({
  items,
  fetchDiseases,
}: AccordionComponentProps) => {
  const [selectedItem, setSelectedItem] = useState<DiseaseItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewChart = (item: DiseaseItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Look how far you have come</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="px-6 py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] font-semibold leading-6 outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&[data-state=open]>svg]:rotate-180">
                <span className="flex items-center gap-3">
                  <span className="flex flex-col space-y-1">
                    <span className="text-xl">{item.name}</span>
                    {item.sub && (
                      <span className="text-sm font-normal">{item.sub}</span>
                    )}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewChart(item);
                    }}
                    className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <EyeIcon size={16} />
                    <span className="sr-only">View progression chart</span>
                  </div>
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="ms-3 pb-2 ps-10 text-muted-foreground">
              <StepperComponent
                progressSteps={item.progress}
                diseaseId={item.id}
                onAddNewEntry={fetchDiseases}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? selectedItem.name : "Severity Progression"}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <SeverityChart progressData={selectedItem.progress} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccordionComponent;
