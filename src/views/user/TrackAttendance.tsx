import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../plugin/axios';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TrackAttendance() {
  const [members, setMembers] = useState<any[]>([]);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [loadingPresent, setLoadingPresent] = useState<Set<number>>(new Set());
  const [loadingAbsent, setLoadingAbsent] = useState<Set<number>>(new Set());

  useEffect(() => {
    setFilteredMembers(
      members.filter((member: any) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, members]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
        const response = await axios.get('list-of-member', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Log the entire response to see the structure
        console.log('API Response:', response);

        // Assuming the API response structure is { listOfMembers: { data: [...] } }
        console.log('List of Members:', response.data.listOfMembersAlreadyAtt);

        setMembers(response.data.listOfMembersAlreadyAtt);
        setFilteredMembers(response.data.listOfMembersAlreadyAtt);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
};

const handleRemoveMember = async (memberId: any, memberName: string, action: string) => {
  try {
      // Fetch the current attendance status of the member
      const currentStatusResponse = await axios.get(`list-of-member/${memberId}`);
      const currentStatus = currentStatusResponse.data.attendance_status;

      // Determine the desired status based on the action
      const desiredStatus = action === 'present' ? 0 : 1;

      // Check if the current status is the same as the desired status
      if (currentStatus === desiredStatus) {
          toast.info(`${memberName} is already marked as ${action}.`);
          return;
      }

      // Set loading state
      if (action === 'present') {
          setLoadingPresent((prev) => new Set(prev).add(memberId));
      } else {
          setLoadingAbsent((prev) => new Set(prev).add(memberId));
      }

      const response = await axios.put(`list-of-member/${memberId}`, {
          attendance_status: 1, // Always set to 1 when updating
          status: desiredStatus,
      });

      if (response.status === 200) {
          if (action === 'present') {
              toast.success(`${memberName} marked as present.`);
          } else {
              toast.error(`${memberName} marked as absent.`);
          }

          // Remove the member from the list
          setMembers((prevMembers) => prevMembers.filter(member => member.id !== memberId));
          setFilteredMembers((prevFilteredMembers) => prevFilteredMembers.filter(member => member.id !== memberId));
      }
  } catch (error: any) {
      if (error.response && error.response.status === 409) {
          // Extract the message from the backend response
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);

          // Do not update the attendance_status if already recorded
          return;
      } else {
          // Handle other errors
          toast.error(`Failed to update attendance for ${memberName}.`);
      }
  } finally {
      // Remove loading state
      if (action === 'present') {
          setLoadingPresent((prev) => {
              const newSet = new Set(prev);
              newSet.delete(memberId);
              return newSet;
          });
      } else {
          setLoadingAbsent((prev) => {
              const newSet = new Set(prev);
              newSet.delete(memberId);
              return newSet;
          });
      }
  }
};

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <ToastContainer />
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80'>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
              <CardTitle className='text-3xl'>List of Attendance</CardTitle>
              <label htmlFor="" className='text-3xl'></label>
                <Input
                  type='text'
                  placeholder='Search'
                  className='w-52'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>Photo</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id} className={removingMemberId === member.id ? 'fade-out' : ''}>
                          <TableCell className="flex justify-center items-center">
                            {member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/storage/${member.photo}`}
                                alt={member.name}
                                className="rounded-full h-10"
                              />
                            ) : (
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-1">
                              <Button
                                className={`text-white h-7 bg-green-500 hover:bg-green-400 rounded-md ${loadingAbsent.has(member.id) || loadingPresent.has(member.id) ? 'cursor-not-allowed' : ''}`}
                                onClick={() => handleRemoveMember(member.id, member.name, 'present')}
                                disabled={loadingAbsent.has(member.id) || loadingPresent.has(member.id)}
                              >
                                {loadingPresent.has(member.id) ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faCheckCircle} /> Present
                                  </>
                                )}
                              </Button>

                              <Button
                                className={`text-white h-7 bg-red-500 hover:bg-red-400 rounded-md ${loadingPresent.has(member.id) || loadingAbsent.has(member.id) ? 'cursor-not-allowed' : ''}`}
                                onClick={() => handleRemoveMember(member.id, member.name, 'absent')}
                                disabled={loadingPresent.has(member.id) || loadingAbsent.has(member.id)}
                              >
                                {loadingAbsent.has(member.id) ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faTimesCircle} /> Absent
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No record found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='flex flex-row justify-between mt-3'>
                <div>
                  <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of {filteredMembers.length} entries</p>
                </div>
                <div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackAttendance;