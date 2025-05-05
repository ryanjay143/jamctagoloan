import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../plugin/axios';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import DialogAddMember from './Layouts/dialog/DialogAddMember';

function TrackAttendance() {
  const initialFormState = {
    fullname: '',
    role: '',
    photo: null as File | null,
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [loadingPresent, setLoadingPresent] = useState<Set<number>>(new Set());
  const [loadingAbsent, setLoadingAbsent] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<{ fullname?: string; role?: string }>({});
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

      console.log('API Response:', response);
      console.log('List of Members:', response.data.listOfMembersAlreadyAtt);

      setMembers(response.data.listOfMembersAlreadyAtt);
      setFilteredMembers(response.data.listOfMembersAlreadyAtt);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors: { fullname?: string; role?: string } = {};
    if (!formData.fullname) newErrors.fullname = 'Full name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    data.append('name', formData.fullname);
    data.append('role', formData.role);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    if (loading) return;
    setLoading(true);

    try {
      await axios.post('list-of-member', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsDialogOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Member added successfully!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        fetchMembers();
      });

      setFormData(initialFormState);
      setPhotoPreview(null);
      setErrors({});
      const fileInput = document.getElementById('picture') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error adding member:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the member. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: any, memberName: string, action: string) => {
    try {
      const currentStatusResponse = await axios.get(`list-of-member/${memberId}`);
      const currentStatus = currentStatusResponse.data.attendance_status;

      const desiredStatus = action === 'present' ? 0 : 1;

      if (currentStatus === desiredStatus) {
        toast.info(`${memberName} is already marked as ${action}.`);
        return;
      }

      if (action === 'present') {
        setLoadingPresent((prev) => new Set(prev).add(memberId));
      } else {
        setLoadingAbsent((prev) => new Set(prev).add(memberId));
      }

      await axios.put(`list-of-member/${memberId}`, {
        attendance_status: 1,
        status: desiredStatus,
      });

      if (action === 'present') {
        toast.success(`${memberName} marked as present.`);
      } else {
        toast.error(`${memberName} marked as absent.`);
      }

      setMembers((prevMembers) => prevMembers.filter(member => member.id !== memberId));
      setFilteredMembers((prevFilteredMembers) => prevFilteredMembers.filter(member => member.id !== memberId));
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
        return;
      } else {
        toast.error(`Failed to update attendance for ${memberName}.`);
      }
    } finally {
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

  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormData({ ...formData, photo: null });
        setPhotoPreview(null);
      } else {
        setFormData({ ...formData, photo: file });

        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full'>
      <ToastContainer />
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80 pl-2 md:pl-0'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <CardTitle className='text-lg md:text-base'>Check Attendance</CardTitle>
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
                      <TableHead className='text-center md:text-xs'>Photo</TableHead>
                      <TableHead className='md:text-xs'>Full Name</TableHead>
                      <TableHead className='md:text-xs'>Role/Ministry</TableHead>
                      <TableHead className="text-right md:text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="flex justify-center md:justify-center item-center md:h-24 ">
                            {member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/storage/${member.photo}`}
                                alt={member.name}
                                className="rounded-full h-10 md:mt-5 w-10"
                              />
                            ) : (
                              <Avatar className='h-10 md:mt-5 w-10'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell className='md:text-xs'>{member.name}</TableCell>
                          <TableCell className='md:text-xs'>{member.role}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end md:flex-col md:gap-3 items-center gap-1">
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
              <div className='flex flex-row justify-end mt-5'>
                <div>
                  <p className='text-primary text-base w-full font-bold'>Showing 1 to {filteredMembers.length} entries</p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
      <DialogAddMember
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        handleInputChange={handleInputChange}
        handleAddFileChange={handleAddFileChange}
        handleSubmit={handleSubmit}
        photoPreview={photoPreview}
        loading={loading}
      />
    </div>
  );
}

export default TrackAttendance;