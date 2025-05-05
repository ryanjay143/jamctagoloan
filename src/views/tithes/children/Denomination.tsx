import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { TableBody, TableCell, TableDeno, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function Denomination() {
  const denominations = [1000, 500, 200, 100, 50, 20, 10, 5, 1];
  const [quantities, setQuantities] = useState<number[]>(Array(denominations.length).fill(0));

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(value) || 0;
    setQuantities(newQuantities);
  };

  const calculateAmount = (denomination: number, quantity: number) => {
    return denomination * quantity;
  };

  const totalAmount = quantities.reduce((total, quantity, index) => {
    return total + calculateAmount(denominations[index], quantity);
  }, 0);

  return (
    <TableDeno>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center border border-white'>Denomination</TableHead>
          <TableHead className='text-center border border-white'>Quantity</TableHead>
          <TableHead className='text-center border border-white'>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {denominations.map((denomination, index) => (
          <TableRow key={denomination}>
            <TableCell className='text-center font-bold text-base border border-primary' data-value={denomination}>
              {denomination}
            </TableCell>
            <TableCell className='text-center border border-primary'>
              <div className='flex justify-center items-center'>
                <Input
                  type="number"
                  placeholder="0"
                  min='0'
                  className='w-full max-w-52'
                  value={quantities[index] === 0 ? '' : quantities[index]} // Show empty if 0
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </div>
            </TableCell>
            <TableCell className='text-center font-bold text-base border border-primary'>
              {calculateAmount(denomination, quantities[index])}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className='text-right font-bold text-base border border-primary' colSpan={2}>
          Total Amount (Cash)
          </TableCell>
          <TableCell className='text-center font-bold text-base border border-primary'>
            {totalAmount}
          </TableCell>
        </TableRow>
      </TableFooter>
    </TableDeno>
  );
}

export default Denomination;
