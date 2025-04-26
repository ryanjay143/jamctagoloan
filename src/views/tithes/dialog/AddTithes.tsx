import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumericFormat } from 'react-number-format';

interface AddTithesProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rows: Array<{
    type: string;
    paymentMethod: string;
    amount: string;
    notes: string;
    date_created?: string;
  }>;
  setRows: React.Dispatch<React.SetStateAction<Array<{
    type: string;
    paymentMethod: string;
    amount: string;
    notes: string;
    date_created?: string;
  }>>>;
  selectedMembers: { [key: number]: string };
  setSelectedMembers: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  members: Array<{ id: string; name: string }>;
  errors: { [key: number]: { member?: string; amount?: string } };
  handleSubmit: (data: any) => void;
  loading: boolean;
  isAddDisabled: boolean;
}

const AddTithes: React.FC<AddTithesProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  rows,
  setRows,
  selectedMembers,
  setSelectedMembers,
  members,
  errors,
  handleSubmit,
  loading,
  isAddDisabled
}) => {
  const handleSelect = (rowIndex: number, memberId: string) => {
    setSelectedMembers(prev => ({
      ...prev,
      [rowIndex]: memberId,
    }));
  };

  const handleTypeChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].type = value;
    setRows(newRows);
  };

  const handlePaymentMethodChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].paymentMethod = value;
    setRows(newRows);
  };

  const handleAmountChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].amount = value;
    setRows(newRows);
  };

  const handleNotesChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].notes = value;
    setRows(newRows);
  };

  const handleDateChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].date_created = value;
    setRows(newRows);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        type: "Tithes and Offering",
        paymentMethod: "Cash",
        amount: "",
        notes: "",
        date_created: getTodayDate() 
      }
    ]);
  };

  const deleteRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
    setSelectedMembers(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const isMemberSelected = (memberId: string) => {
    return Object.values(selectedMembers).includes(memberId);
  };

  const handleFormSubmit = () => {
    const today = getTodayDate();
    const dataToSubmit = rows.map((row, index) => ({
      member_id: selectedMembers[index],
      type: row.type,
      amount: row.amount,
      payment_method: row.paymentMethod,
      date_created: row.date_created || today, // Ensure default date
      notes: row.notes,
    }));
  
    console.log("Submitting data:", dataToSubmit);
    handleSubmit({ tithes: dataToSubmit });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="overflow-auto h-screen w-[98%] max-w-6xl mx-auto backdrop-blur-sm">
        <DialogHeader className="text-start">
          <DialogTitle>Add Tithes & Offering</DialogTitle>
          <DialogDescription>
            {rows.map((row, index) => (
              <div key={index} className="mt-5 mb-5 p-4 border border-b-4 border-primary rounded-lg flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="date_created">Date Created</Label>
                  <Input
                    type="date"
                    value={row.date_created || getTodayDate()}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="member">Member <span className="text-red-500">*</span></Label>
                  <Select
                    value={selectedMembers[index] || ""}
                    onValueChange={(value) => handleSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent className="overflow-auto max-h-[200px]">
                      {members
                        .filter(member => !isMemberSelected(member.id) || selectedMembers[index] === member.id)
                        .map(member => (
                          <SelectItem key={member.id} value={member.id} className="cursor-pointer hover:bg-gray-200">
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors[index]?.member && (
                    <span className="text-red-500 text-xs">{errors[index].member}</span>
                  )}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="type">Type:</Label>
                  <Select
                    value={row.type}
                    onValueChange={(value) => handleTypeChange(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tithes and Offering" className="cursor-pointer hover:bg-gray-200">Tithes and Offering</SelectItem>
                      <SelectItem value="Help fund" className="cursor-pointer hover:bg-gray-200">Help Fund</SelectItem>
                      <SelectItem value="Solomon Pledge" className="cursor-pointer hover:bg-gray-200">Solomon Pledge</SelectItem>
                      <SelectItem value="Others" className="cursor-pointer hover:bg-gray-200">Others...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="amount">Amount (PHP) <span className="text-red-500">*</span></Label>
                  <NumericFormat
                    thousandSeparator={true}
                    prefix={'₱ '}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    value={row.amount}
                    onValueChange={(values) => {
                      const { value } = values;
                      handleAmountChange(index, value);
                    }}
                    className="flex h-9 w-full rounded-md border border-primary bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" // Add your input class here
                    placeholder="0.00"
                  />
                  {errors[index]?.amount && (
                    <span className="text-red-500 text-xs">{errors[index].amount}</span>
                  )}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select
                    value={row.paymentMethod}
                    onValueChange={(value) => handlePaymentMethodChange(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash" className="cursor-pointer hover:bg-gray-200">Cash</SelectItem>
                      <SelectItem value="Gcash" className="cursor-pointer hover:bg-gray-200">Gcash</SelectItem>
                      <SelectItem value="Bank transfer" className="cursor-pointer hover:bg-gray-200">Bank Transfer</SelectItem>
                      <SelectItem value="Others" className="cursor-pointer hover:bg-gray-200">Others...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <div className="flex justify-between">
                    <Input
                      placeholder="Type your notes here..."
                      value={row.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-400 ml-2 h-9"
                        onClick={() => deleteRow(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </DialogDescription>

          <div className="pt-3">
            <Button
              className="bg-blue-500 hover:bg-blue-400 h-7"
              onClick={addRow}
              disabled={isAddDisabled}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Tithes
            </Button>
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" className="bg-red-500 hover:bg-red-400" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400"
              onClick={handleFormSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Submitting...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 ml-2" />
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTithes;