"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatDate } from "date-fns";
import { PlusIcon, Loader, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import FileUpload from "./ui/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { uploadImage } from "@/BackendConnect/imageupload";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/authContext";
import { addProgressToDisease } from "@/firebase/firestoreConnect";
import { deleteProgressAndPossiblyDisease } from "@/firebase/firestoreConnect";
interface StepperComponentProps {
  progressSteps: {
    severity: string;
    imgUrl: string;
    createdAt: string;
    id: string;
  }[];
  diseaseId: string;
  onAddNewEntry: () => void;
}

const StepperComponent = ({
  progressSteps,
  diseaseId,
  onAddNewEntry,
}: StepperComponentProps) => {
  const [image, setImage] = useState<FileWithPreview | null>(null);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { getUser } = useContext(AuthContext);
  const user = getUser();
  console.log(progressSteps);
  const handleFileChange = (fileWithPreview: FileWithPreview) => {
    setImage(fileWithPreview);
  };

  const handleRemove = () => {
    setImage(null);
  };

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected");
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload image to backend for disease classification
      const result = await uploadImage(image.file);

      if (!result?.result) {
        console.error("Invalid result from uploadImage");
        toast.error("Failed to upload image");
        setIsUploading(false);
        return;
      }

      // Extract disease name and severity from result
      const [diseaseName, severity] = result.result.split(",");

      if (!diseaseName || !severity) {
        console.error("Disease name or severity is missing");
        toast.error("Failed to extract disease details");
        setIsUploading(false);
        return;
      }

      // Step 2: Upload image to server for storage
      const formData = new FormData();

      // Check if image.file is a File object
      if (image.file instanceof File) {
        formData.append("file", image.file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const { url } = data;

        if (!url) {
          console.error("Failed to upload image to server");
          toast.error("Image upload failed");
          setIsUploading(false);
          return;
        }

        // Step 3: Add progress to disease in Firestore
        if (user && user.email) {
          await addProgressToDisease(url, severity, user.email, diseaseId);
          console.log("Progress added to disease:", diseaseId);
        } else {
          console.error("User email not available");
          toast.error("Could not update progress - user information missing");
        }

        // Console log the results
        console.log("Disease severity:", severity);
        console.log("Uploaded image URL:", url);

        // Success message
        toast.success("Progress entry added successfully!");
      } else {
        console.error("Not a valid File object");
        toast.error("Invalid file format");
        setIsUploading(false);
        return;
      }

      // Close dialog and reset form
      setOpen(false);
      setImage(null);
    } catch (error) {
      console.error("Error during upload process:", error);
      toast.error("An error occurred during the upload process");
    } finally {
      setIsUploading(false);
    }
    onAddNewEntry();
  };

  const handleDeleteProgressItem = async (progressId: string) => {
    console.log("Delete progress item:", progressId);
    // Future implementation will delete this progress entry
    await deleteProgressAndPossiblyDisease(user.email, diseaseId, progressId);
    onAddNewEntry();
  };

  return (
    <div className="space-y-4 px-10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Image</TableHead>
            <TableHead>Severity level</TableHead>
            <TableHead>Created on</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {progressSteps.map((item) => (
            <TableRow key={item.id || item.severity}>
              <TableCell>
                <div className="relative h-10 w-10">
                  <Image
                    className="rounded-full"
                    src={item.imgUrl}
                    alt={item.severity}
                    fill
                  />
                </div>
              </TableCell>
              <TableCell>{item.severity}</TableCell>
              <TableCell>
                {formatDate(item?.createdAt || new Date(), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProgressItem(item.id)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Delete progress item</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add new entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Entry</DialogTitle>
              <DialogDescription>
                Upload an image to add a new entry to the table.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <FileUpload
                onFileChange={handleFileChange}
                onRemove={handleRemove}
                disabled={isUploading}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleUpload}
                disabled={!image || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StepperComponent;
