import React, { useEffect, useState } from 'react';
import axios from '../../plugin/axios';
import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

// Define a type for the expense object
type Expense = {
  date_created: string;
  title: string;
  amount: string;
};

// Utility function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function TithesExpense() {
  const initialExpenseState: Expense[] = [{ date_created: getTodayDate(), title: '', amount: '' }];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenseInputs, setExpenseInputs] = useState<Expense[]>(initialExpenseState);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ title: string; amount: string }[]>([{ title: '', amount: '' }]);

  const fetchExpense = async () => {
    try {
      const response = await axios.get('tithes', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setExpense(response.data.expenses);
      console.log("Expense:", response.data.expenses);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleAddInputRow = () => {
    setExpenseInputs([...expenseInputs, { date_created: getTodayDate(), title: '', amount: '' }]);
    setErrors([...errors, { title: '', amount: '' }]);
  };

  const handleInputChange = (index: number, field: keyof Expense, value: string) => {
    const newInputs = [...expenseInputs];
    newInputs[index][field] = value;
    setExpenseInputs(newInputs);

    // Validate input
    const newErrors = [...errors];
    if (field === 'title' && value.trim() === '') {
      newErrors[index].title = 'Title is required';
    } else {
      newErrors[index].title = '';
    }

    if (field === 'amount' && (value.trim() === '' || isNaN(Number(value)))) {
      newErrors[index].amount = 'Valid amount is required';
    } else {
      newErrors[index].amount = '';
    }

    setErrors(newErrors);
  };

  const handleDeleteRow = (index: number) => {
    const newInputs = expenseInputs.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setExpenseInputs(newInputs);
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    // Validate all inputs before submitting
    const newErrors = expenseInputs.map(input => ({
      title: input.title.trim() === '' ? 'Title is required' : '',
      amount: input.amount.trim() === '' || isNaN(Number(input.amount)) ? 'Valid amount is required' : '',
    }));

    setErrors(newErrors);

    // Check for any validation errors
    const hasErrors = newErrors.some(error => error.title || error.amount);
    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('expenses', { expenses: expenseInputs });

      setExpenseInputs(initialExpenseState);
      setErrors([{ title: '', amount: '' }]);
      setIsDialogOpen(false);
      fetchExpense();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error processing expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80 pl-2 md:pl-0'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <CardTitle className='text-lg md:text-base'>List of Expense</CardTitle>
                <Input
                  type='text'
                  placeholder='Search'
                  className='w-52'
                />
              </div>
              <div className='overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center md:text-xs'>#</TableHead>
                      <TableHead className='text-center md:text-xs'>Date created</TableHead>
                      <TableHead className='text-center md:text-xs'>Title</TableHead>
                      <TableHead className='md:text-xs'>Amount</TableHead>
                      <TableHead className='md:text-xs'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expense.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center text-gray-500'>No Expense found</TableCell>
                      </TableRow>
                    )}
                    {expense.map((expenses, index) => (
                      <TableRow key={expenses.id}>
                        <TableCell className='md:text-xs'>{index + 1}</TableCell>
                        <TableCell className='md:text-xs uppercase font-bold'>{format(new Date(expenses.date_created), 'MMMM dd, yyyy')}</TableCell>
                        <TableCell className='md:text-xs uppercase font-bold'>{expenses.title}</TableCell>
                        <TableCell className='md:text-xs font-bold'>
                          {expenses.amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                        </TableCell>
                        <TableCell className='md:text-xs'>
                          <div className="flex justify-end md:flex-col md:gap-3 items-center gap-1">
                            <Button
                              className="text-white w-7 h-7 bg-green-500 hover:bg-green-400 rounded-md"
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </Button>
                            <Button
                              className='text-white bg-red-500 w-7 h-7 hover:bg-red-400 rounded-md'
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className='flex flex-row justify-end mt-5'>
                <div>
                  <p className='text-[#172554] text-base w-full font-bold'>Showing 1 to 10 entries</p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </DialogTrigger>
        <DialogContent className='overflow-auto max-w-[600px] max-h-[80vh] md:max-h-[90vh] md:max-w-[450px]'>
          <div>
            <DialogHeader className='text-start'>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>
                Add expense to the list.
                <div className='grid grid-cols-3 gap-4 mt-4'>
                  {expenseInputs.map((input, index) => (
                    <React.Fragment key={index}>
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`date-${index}`}>Date</Label>
                        <Input
                          id={`date-${index}`}
                          type="date"
                          value={input.date_created}
                          onChange={(e) => handleInputChange(index, 'date_created', e.target.value)}
                        />
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          type="text"
                          placeholder="Enter your title here"
                          value={input.title}
                          onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        />
                        {errors[index].title && <p className="text-red-500 text-xs mt-1">{errors[index].title}</p>}
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`amount-${index}`}>Amount</Label>
                        <div className='flex flex-row gap-2'>
                          <Input
                            id={`amount-${index}`}
                            type="text"
                            placeholder="0.00"
                            value={input.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                          />
                          {index > 0 && (
                            <Button
                              className='bg-red-500 hover:bg-red-400 w-10'
                              onClick={() => handleDeleteRow(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          )}
                        </div>
                        {errors[index].amount && <p className="text-red-500 text-xs mt-1">{errors[index].amount}</p>}
                      </div>
                    </React.Fragment>
                  ))}

                  <div className="col-span-3 flex justify-start">
                    <Button
                      className='bg-blue-500 hover:bg-blue-400 w-32 h-7'
                      onClick={handleAddInputRow}
                    ><FontAwesomeIcon icon={faPlus}/>
                      Add Expense
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className='flex flex-row justify-end'>
            <Button className='w-56' type="button" onClick={handleSubmit} disabled={loading}>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TithesExpense;