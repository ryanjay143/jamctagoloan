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
// import { format } from 'date-fns';
import AddTithes from './dialog/AddTithes';
import EditTithes from './dialog/EditTithes'; // Import the EditTithes component

function TithesGiving() {
  const [selectedMembers, setSelectedMembers] = useState<{ [key: number]: string }>({});
  const [rows, setRows] = useState([{ type: "Tithes and Offering", paymentMethod: "Cash", amount: "", notes: "" }]);
  const [members, setMembers] = useState<any[]>([]);
  const [tithes, setTithes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [errors, setErrors] = useState<{ [key: number]: { member?: string; amount?: string } }>({});
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [editingTitheId, setEditingTitheId] = useState<string | null>(null); // State for tracking the editing tithe ID

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
      console.log('Response:', response.data);

      setRows([{ type: "Tithes and Offering", paymentMethod: "Cash", amount: "", notes: "" }]);
      setSelectedMembers({});
      setIsDialogOpen(false);
      fetchMembersAndTithes();

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error submitting tithes:', error);
    } finally {
      setLoading(false);
      setIsAddDisabled(false);
    }
  };

  // Filter tithes based on search query
  const filteredTithes = tithes.filter((tithe) =>
    (tithe.member?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    tithe.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tithe.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) || // Include payment method in search
    (tithe.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditTithe = async (updatedTithe: any) => {
    try {
      const response = await axios.put(`tithes/${updatedTithe.id}`, updatedTithe, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      fetchMembersAndTithes();
      setEditingTitheId(null); // Close the dialog after editing

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      // Update the tithes list with the updated tithe
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

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <CardTitle className='text-lg md:text-base'>Tithes today</CardTitle>
                <Input
                  type='text'
                  placeholder='Search'
                  className='w-52'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
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
                      <TableHead className='md:text-xs'>Notes</TableHead>
                      <TableHead className="text-right md:text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTithes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className='text-center'>
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
                        <TableCell className='md:text-xs'>{tithe.member?.name || 'Unknown'}</TableCell>
                        <TableCell className='md:text-xs'>PHP {tithe.amount}</TableCell>
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
              <div className='flex flex-row justify-end mt-5'>
                <div>
                  <p className='text-[#172554] text-base w-full font-bold'>Showing 1 to {filteredTithes.length} entries</p>
                </div>
              </div>
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