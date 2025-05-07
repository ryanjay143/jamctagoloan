
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday } from 'date-fns';
import { NumericFormat, NumberFormatValues } from 'react-number-format';

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
  const isButtonEnabled = isToday(createdAtDate);

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate inputs and handle save
  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tithe.amount || parseFloat(tithe.amount) === 0) {
      newErrors.amount = "Amount must be greater than zero.";
    }
    if (!tithe.type) {
      newErrors.type = "Type is required.";
    }
    if (!tithe.payment_method) {
      newErrors.payment_method = "Payment method is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleEditTithe(tithe);
    }
  };

  return (
    <Dialog open={editingTitheId === tithe.id} onOpenChange={(isOpen) => {
      if (!isOpen && (tithe.amount === "" || parseFloat(tithe.amount) === 0)) {
        return;
      }
      setEditingTitheId(isOpen ? tithe.id : null);
    }}>
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
                <Input value={tithe.member?.name || 'No name'} readOnly className="col-span-3 cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_created" className="text-start">
                  Date created
                </Label>
                <Input
                  value={tithe.date_created}
                  type="date"
                  onChange={(e) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].date_created = e.target.value;
                    return updated;
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-start">
                  Amount 
                </Label>
                <NumericFormat
                  thousandSeparator={true}
                  prefix={'₱ '}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  value={tithe.amount}
                  onValueChange={(values: NumberFormatValues) => setTithes((prev) => {
                    const updated = [...prev];
                    updated[index].amount = values.value;
                    return updated;
                  })}
                  className="flex h-9 w-full col-span-3 rounded-md border border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="0.00"
                />
                {errors.amount && <span className="text-red-500 text-xs col-span-3">{errors.amount}</span>}
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
                {errors.type && <span className="text-red-500 text-xs col-span-3">{errors.type}</span>}
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
                {errors.payment_method && <span className="text-red-500 text-xs col-span-3">{errors.payment_method}</span>}
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
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTithes;
