import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Define the types for the props
interface AddTithesProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rows: Array<{ type: string; paymentMethod: string; amount: string; notes: string }>;
  setRows: React.Dispatch<React.SetStateAction<Array<{ type: string; paymentMethod: string; amount: string; notes: string }>>>;
  selectedMembers: { [key: number]: string };
  setSelectedMembers: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  members: Array<{ id: string; name: string }>;
  errors: { [key: number]: { member?: string; amount?: string } };
  handleSubmit: () => void;
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
    setSelectedMembers((prevSelected) => ({
      ...prevSelected,
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

  const addRow = () => {
    setRows([...rows, { type: "Tithes and Offering", paymentMethod: "Cash", amount: "", notes: "" }]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
    setSelectedMembers((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      delete updatedSelected[index];
      return updatedSelected;
    });
  };

  const isMemberSelected = (memberId: string) => {
    return Object.values(selectedMembers).includes(memberId);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className='overflow-auto h-screen w-[98%] max-w-6xl mx-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>Add tithes & offering</DialogTitle>
          <DialogDescription>
            {rows.map((row, index) => (
              <div key={index} className='mt-5 grid grid-cols-5 md:grid-cols-3 md:gap-5 gap-3'>
                <div className="md:col-span-2 grid w-full items-center gap-1">
                  <Label htmlFor="member">Member <span className='text-red-500 '>*</span></Label>
                  <Select
                    value={selectedMembers[index] || ""}
                    onValueChange={(value) => handleSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent className="overflow-auto max-h-[200px]">
                      {members
                        .filter((member) => !isMemberSelected(member.id) || selectedMembers[index] === member.id)
                        .map((member) => (
                          <SelectItem
                            className="cursor-pointer hover:bg-gray-200"
                            key={member.id}
                            value={member.id}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors[index]?.member && <span className="text-red-500 text-xs">{errors[index].member}</span>}
                </div>

                <div className="md:col-span-2 grid w-full items-center gap-1">
                  <Label htmlFor="type">Type:</Label>
                  <Select value={row.type} onValueChange={(value) => handleTypeChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tithes and Offering">Tithes and Offering</SelectItem>
                      <SelectItem value="Help fund">Help fund</SelectItem>
                      <SelectItem value="Solomon Pledge">Solomon Pledge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1 grid w-full items-center gap-1">
                  <Label htmlFor="amount">Amount (PHP) <span className='text-red-500'>*</span></Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    value={row.amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                  />
                  {errors[index]?.amount && <span className="text-red-500 text-xs">{errors[index].amount}</span>}
                </div>
                <div className="md:col-span-2 grid w-full items-center gap-1">
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select value={row.paymentMethod} onValueChange={(value) => handlePaymentMethodChange(index, value)}>
                    <SelectTrigger>
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

                <div className="md:col-span-1 grid w-full items-center gap-1">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <div className='flex justify-between'>
                    <Input
                      placeholder="Type your notes here..."
                      value={row.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                    />
                    {index > 0 && (
                      <Button className='bg-red-500 hover:bg-red-400 ml-2 h-9' onClick={() => deleteRow(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </DialogDescription>
          <div className='pt-3'>
            <Button
              className='bg-blue-500 hover:bg-blue-400 h-7'
              onClick={addRow}
              disabled={isAddDisabled}
            >
              <FontAwesomeIcon icon={faPlus} /> Add tithes
            </Button>
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" className='bg-red-500 hover:bg-red-400' disabled={loading}>Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className='bg-blue-500 hover:bg-blue-400'
              onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span>Submit...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  Submit
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTithes;