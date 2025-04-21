import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday } from 'date-fns';

interface EditTithesProps {
  tithe: any;
  editingTitheId: string | null;
  setEditingTitheId: React.Dispatch<React.SetStateAction<string | null>>;
  handleEditTithe: (updatedTithe: any) => void;
  index: number;
  setTithes: React.Dispatch<React.SetStateAction<any[]>>;
}

function EditTithes({ tithe, editingTitheId, setEditingTitheId, handleEditTithe, index, setTithes }: EditTithesProps) {
  const createdAtDate = new Date(tithe.created_at);

  // Determine if the button should be enabled
  const isButtonEnabled = isToday(createdAtDate);

  return (
    <Dialog open={editingTitheId === tithe.id} onOpenChange={(isOpen) => setEditingTitheId(isOpen ? tithe.id : null)}>
      <DialogTrigger asChild>
        <Button
          className={`text-white w-7 h-7 rounded-md ${
            isButtonEnabled ? 'bg-green-500 hover:bg-green-400' : ''
          }`}
          disabled={!isButtonEnabled}
        >
          <FontAwesomeIcon icon={faPen} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit tithes</DialogTitle>
          <DialogDescription>
            Make changes to your tithes here. Click save when you're done.
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-start">
                  Fullname
                </Label>
                <Input value={tithe.member?.name} readOnly className="col-span-3 cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-start">
                  Amount
                </Label>
                <Input
                  value={tithe.amount}
                  onChange={(e) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].amount = e.target.value;
                    return updated;
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-start">
                  Type
                </Label>
                <Select
                  value={tithe.type}
                  onValueChange={(value) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].type = value;
                    return updated;
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tithes and Offering">Tithes and Offering</SelectItem>
                    <SelectItem value="Help fund">Help fund</SelectItem>
                    <SelectItem value="Solomon Pledge">Solomon Pledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentMethod" className="text-start">
                  Payment method
                </Label>
                <Select
                  value={tithe.payment_method}
                  onValueChange={(value) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].payment_method = value;
                    return updated;
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Gcash">Gcash</SelectItem>
                    <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-start">
                  Notes
                </Label>
                <Textarea
                  value={tithe.notes}
                  onChange={(e) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].notes = e.target.value;
                    return updated;
                  })}
                  className="col-span-3"
                  placeholder='Add notes'
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={() => handleEditTithe(tithe)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTithes;