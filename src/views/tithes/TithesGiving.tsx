import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../plugin/axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import AddTithes from './dialog/AddTithes';
import EditTithes from './dialog/EditTithes';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Check } from 'lucide-react';
// import { cn } from "@/lib/utils";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function TithesGiving() {
  const [selectedMembers, setSelectedMembers] = useState<{ [key: number]: string }>({});
  const [rows, setRows] = useState([{ type: "Tithes and Offering", paymentMethod: "Cash", amount: "", notes: "" }]);
  const [members, setMembers] = useState<any[]>([]);
  const [tithes, setTithes] = useState<any[]>([]);
  // const [totalTithes, setTithesTotal] = useState<number>(0);
  // const [totalTithesLastSunday, setTithesTotalLastSunday] = useState<number>(0);
  // const [totalTithesToday, setTithesTotalToday] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [errors, setErrors] = useState<{ [key: number]: { member?: string; amount?: string } }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitheId, setEditingTitheId] = useState<string | null>(null);
  // const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState("");
  // const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    fetchMembersAndTithes();
  }, []);

  const fetchMembersAndTithes = async () => {
    try {
      const response = await axios.get('tithes', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMembers(response.data.listOfMembers);
      setTithes(response.data.tithes);
      // setTithesTotal(response.data.totalAmount);
      // setTithesTotalLastSunday(response.data.totalAmountLastSunday);
      // setTithesTotalToday(response.data.totalAmountToday);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const validateInputs = () => {
    const newErrors: { [key: number]: { member?: string; amount?: string } } = {};
    rows.forEach((row, index) => {
      if (!selectedMembers[index]) {
        newErrors[index] = { ...newErrors[index], member: "Member is required" };
      }
      if (!row.amount || parseFloat(row.amount) <= 0) {
        newErrors[index] = { ...newErrors[index], amount: "Amount must be greater than 0" };
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateInputs()) return;

    setLoading(true);
    setIsAddDisabled(true);

    const tithesData = rows.map((row, index) => ({
      member_id: selectedMembers[index],
      type: row.type,
      amount: parseFloat(row.amount),
      payment_method: row.paymentMethod,
      notes: row.notes,
    }));

    try {
      const response = await axios.post('tithes', { tithes: tithesData }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setRows([{ type: "Tithes and Offering", paymentMethod: "Cash", amount: "", notes: "" }]);
      setSelectedMembers({});
      setIsDialogOpen(false);
      fetchMembersAndTithes();

      const message = response.data.message;
      const isPartialSuccess = message.includes('Note: Some members already had tithes recorded today.');

      Swal.fire({
        icon: isPartialSuccess ? 'warning' : 'success',
        title: isPartialSuccess ? 'Partial Success' : 'Success',
        text: message,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error submitting tithes:', error);
    } finally {
      setLoading(false);
      setIsAddDisabled(false);
    }
  };

  const handleEditTithe = async (updatedTithe: any) => {
    try {
      const response = await axios.put(`tithes/${updatedTithe.id}`, updatedTithe, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      fetchMembersAndTithes();
      setEditingTitheId(null);

      const message = response.data.message;
      const isPartialSuccess = message.includes('Note: Some members already had tithes recorded today.');

      Swal.fire({
        icon: isPartialSuccess ? 'warning' : 'success',
        title: isPartialSuccess ? 'Partial Success' : 'Success',
        text: message,
        timer: 2000,
        showConfirmButton: false,
      });

      setTithes((prevTithes) =>
        prevTithes.map((tithe) => (tithe.id === updatedTithe.id ? response.data.tithes : tithe))
      );
    } catch (error) {
      console.error('Error updating tithes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update tithes. Please try again.',
      });
    }
  };

  // const months = [
  //   { value: 'all', label: 'All' },
  //   { value: 'january', label: 'January' },
  //   { value: 'february', label: 'February' },
  //   { value: 'march', label: 'March' },
  //   { value: 'april', label: 'April' },
  //   { value: 'may', label: 'May' },
  //   { value: 'june', label: 'June' },
  //   { value: 'july', label: 'July' },
  //   { value: 'august', label: 'August' },
  //   { value: 'september', label: 'September' },
  //   { value: 'october', label: 'October' },
  //   { value: 'november', label: 'November' },
  //   { value: 'december', label: 'December' },
  // ];

  // Filter tithes based on search query and selected date range
  const filteredTithes = tithes.filter((tithe) => {
    // const createdAtDate = new Date(tithe.created_at);
  
    // // Filter by selected month
    // if (selectedMonth !== 'all') {
    //   const monthIndex = months.findIndex((month) => month.value === selectedMonth) - 1;
    //   if (createdAtDate.getMonth() !== monthIndex) {
    //     return false;
    //   }
    // }
  
    // // Filter by date range
    // if (selectedDateRange === 'today' && !isToday(createdAtDate)) {
    //   return false;
    // }
  
    // if (selectedDateRange === 'lastSunday') {
    //   const lastSunday = subDays(new Date(), new Date().getDay());
    //   if (!isSunday(createdAtDate) || createdAtDate < lastSunday) {
    //     return false;
    //   }
    // }
  
    // Filter by search query
    return (
      (tithe.member?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      tithe.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tithe.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tithe.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80 pl-2 md:pl-0'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <CardTitle className='text-lg md:text-base md:hidden'>Tithes today</CardTitle>

                <div className='grid md:justify-end md:gap-2'>
                {/* <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] md:w-[95%] justify-between border border-primary"
                    >
                      {value
                        ? months.find((month) => month.value === value)?.label
                        : "Select month..."}
                      <FontAwesomeIcon icon={faAngleDown} className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] md:w-[95%] p-0">
                    <Command>
                      <CommandInput placeholder="Search month..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No month found.</CommandEmpty>
                        <CommandGroup>
                          {months.map((month) => (
                            <CommandItem
                              key={month.value}
                              value={month.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                setSelectedMonth(currentValue === value ? "all" : currentValue);
                                setOpen(false);
                              }}
                            >
                              {month.label}
                              <Check
                                className={cn(
                                  "ml-auto text-green-500",
                                  value === month.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover> */}

                  {/* <Select onValueChange={(value) => setSelectedDateRange(value)}>
                    <SelectTrigger className='w-[200px] md:w-[95%]'>
                      <SelectValue placeholder="Select Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="lastSunday">Last Sunday</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}

                  <Input
                    type='text'
                    placeholder='Search by name, type, payment method, or notes'
                    className='w-52 placeholder-small md:w-[95%]'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className='overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center md:text-xs'>#</TableHead>
                      <TableHead className='text-center md:text-xs'>Photo</TableHead>
                      <TableHead className='md:text-xs'>Full Name</TableHead>
                      <TableHead className='md:text-xs'>Amount</TableHead>
                      <TableHead className='md:text-xs'>Type</TableHead>
                      <TableHead className='md:text-xs'>Payment Method</TableHead>
                      <TableHead className='md:text-xs'>Date Giving</TableHead>
                      <TableHead className='md:text-xs'>Notes</TableHead>
                      <TableHead className="text-right md:text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTithes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className='text-center'>
                          No tithes found.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredTithes.map((tithe, index) => (
                      <TableRow key={tithe.id}>
                        <TableCell className='md:text-xs'>{index + 1}</TableCell>
                        <TableCell className="flex justify-center md:justify-center item-center md:h-24 ">
                          {tithe.member?.photo ? (
                            <img
                              src={`${import.meta.env.VITE_URL}/storage/${tithe?.member.photo}`}
                              alt={tithe.member.name}
                              className="rounded-full h-10 w-10"
                            />
                          ) : (
                            <Avatar>
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          )}
                        </TableCell>
                        <TableCell className='md:text-xs'>{tithe.member?.name}</TableCell>
                        <TableCell className='md:text-xs'>{tithe.amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}</TableCell>
                        <TableCell className='md:text-xs'>{tithe.type}</TableCell>
                        <TableCell className='md:text-xs'>
                          {tithe.payment_method === "Cash" && (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                              Cash
                            </span>
                          )}
                          {tithe.payment_method === "Gcash" && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                              Gcash
                            </span>
                          )}
                          {tithe.payment_method === "Bank transfer" && (
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">
                              Bank transfer
                            </span>
                          )}
                          {tithe.payment_method === "Others" && (
                            <span className="inline-flex items-center rounded-md bg-[#1f2937] px-2 py-1 text-xs font-medium text-light">
                              Others
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='md:text-xs'>
                          {format(new Date(tithe.date_created), 'MMMM dd, yyyy')}
                        </TableCell>
                        <TableCell className='md:text-xs'>{tithe.notes || "None"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end md:flex-col md:gap-3 items-center gap-1">
                            <EditTithes
                              tithe={tithe}
                              editingTitheId={editingTitheId}
                              setEditingTitheId={setEditingTitheId}
                              handleEditTithe={handleEditTithe}
                              index={index}
                              setTithes={setTithes}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* <div className='flex flex-row justify-between mt-5'>
                <div className='bg-white md:shadow-muted md:border-none border border-b-4  border-primary shadow-md rounded-lg p-4'>
                  {selectedDateRange === 'all' && (
                    <div className='flex items-center mb-4'>
                      <FontAwesomeIcon icon={faCoins} className='text-yellow-500 mr-2' size='lg' />
                      <div className='text-primary text-base font-bold'>
                        Overall Total Tithes: {totalTithes.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                      </div>
                    </div>
                  )}
                  {selectedDateRange === 'today' && (
                    <div className='flex items-center mb-4'>
                      <FontAwesomeIcon icon={faCalendarDay} className='text-blue-500 mr-2' size='lg' />
                      <div className='text-primary text-base font-bold'>
                        Total Tithes Today: {totalTithesToday.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                      </div>
                    </div>
                  )}
                  {selectedDateRange === 'lastSunday' && (
                    <div className='flex items-center'>
                      <FontAwesomeIcon icon={faCalendarWeek} className='text-green-500 mr-2' size='lg' />
                      <div className='text-primary text-base font-bold'>
                        Total Tithes Last Sunday: {totalTithesLastSunday.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                      </div>
                    </div>
                  )}
                  </div>
                  <div>
                  <p className='text-primary text-base w-full font-bold'>Showing 1 to {filteredTithes.length} entries</p>
                </div>
              </div> */}
            </CardContent>
          </div>
        </div>
      </div>
      <Button onClick={() => setIsDialogOpen(true)} className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <AddTithes
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        rows={rows}
        setRows={setRows}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        members={members}
        errors={errors}
        handleSubmit={handleSubmit}
        loading={loading}
        isAddDisabled={isAddDisabled}
      />
    </div>
  );
}

export default TithesGiving;