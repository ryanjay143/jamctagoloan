
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCheckCircle, faPlus, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

function TrackAttendance() {
  const initialFormState = {
    fullname: '',
    role: '',
    photo: null as File | null,
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
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
      const response = await axios.post('list-of-member', data, {
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

      const response = await axios.put(`list-of-member/${memberId}`, {
        attendance_status: 1,
        status: desiredStatus,
      });

      if (response.status === 200) {
        if (action === 'present') {
          toast.success(`${memberName} marked as present.`);
        } else {
          toast.error(`${memberName} marked as absent.`);
        }

        setMembers((prevMembers) => prevMembers.filter(member => member.id !== memberId));
        setFilteredMembers((prevFilteredMembers) => prevFilteredMembers.filter(member => member.id !== memberId));
      }
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
                      <TableHead>Role/Ministry</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id} className={removingMemberId === member.id ? 'fade-out' : ''}>
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
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
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
              <div className='flex flex-row justify-center mt-5'>
                <div>
                  <p className='text-[#172554] text-base w-full font-bold'>Showing 1 to {filteredMembers.length} entries</p>
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
        <DialogContent className='overflow-auto max-h-[80vh] md:max-h-[90vh]'>
          <div>
            <DialogHeader className='text-start'>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>
                Add a new member to the list.
              </DialogDescription>
            </DialogHeader>

            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  type="text"
                  name="fullname"
                  placeholder="Enter fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
                {errors.fullname && <span className="text-red-500">{errors.fullname}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="role">Role/Ministry</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role or ministry" />
                  </SelectTrigger>
                  <SelectContent className='max-h-60 overflow-auto'>
                    <SelectItem value="First timer">First timer</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Church Pastor">Church Pastor</SelectItem>
                    <SelectItem value="Multimedia Service Team">Multimedia Service Team</SelectItem>
                    <SelectItem value="Ushering Service Team">Ushering Service Team</SelectItem>
                    <SelectItem value="Prayer Service Team">Prayer Service Team</SelectItem>
                    <SelectItem value="Finance Team">Finance Team</SelectItem>
                    <SelectItem value="Praise & Worship Team">Praise & Worship Team</SelectItem>
                    <SelectItem value="Kids Ministry">Kids Ministry</SelectItem>
                    <SelectItem value="Cleaning Minstry">Cleaning Minstry</SelectItem>
                    <SelectItem value="Family life">Family life</SelectItem>
                    <SelectItem value="Arrow life">Arrow life</SelectItem>
                    <SelectItem value="Visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-red-500">{errors.role}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="picture">Photo</Label>
                <Input
                  id="add-picture"
                  type="file"
                  onChange={handleAddFileChange}
                  accept="image/*"
                />
                {photoPreview && <img src={photoPreview} alt="Preview" className="w-full h-60 rounded-md" />}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span>Adding Member...</span>
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faAdd} />
                      <span>Add Member</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TrackAttendance;
