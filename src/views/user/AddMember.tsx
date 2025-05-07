import React, { useState, useEffect } from 'react';
import axios from '../../plugin/axios';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Swal from 'sweetalert2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditMemberInfo from './EditMemberInfo';
import DialogAddMember from './Layouts/dialog/DialogAddMember';

const AddMember: React.FC = () => {
  const initialFormState = {
    fullname: '',
    role: '',
    photo: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<{ fullname?: string; role?: string }>({});
  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member: any) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, members]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
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

        // Create a FileReader to read the file and set the preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
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
  
      // Reset the form, photo preview, and errors
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
      console.log('List of Members:', response.data.listOfMembers);

      setMembers(response.data.listOfMembers);
      setFilteredMembers(response.data.listOfMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleMemberUpdate = (updatedMember: any) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setFilteredMembers((prevFilteredMembers) =>
      prevFilteredMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80 pl-2 md:pl-0'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
              <CardTitle className='text-lg md:text-base'>List of Member</CardTitle>
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
                      <TableHead className='md:text-xs'>Status</TableHead>
                      <TableHead className="text-right md:text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="flex justify-center items-center">
                            {member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/${member.photo}`}
                                alt={member.name || 'Member Photo'}
                                className="rounded-full h-10 w-10"
                              />
                            ) : (
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell className='md:text-xs'>{member.name}</TableCell>
                          <TableCell className='md:text-xs'>{member.role}</TableCell>
                          <TableCell>
                            {member.church_status === '0' ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Active
                              </span>
                            ) : member.church_status === '1' ? (
                              <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                                Inactive
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-1">
                              <EditMemberInfo member={member} onUpdate={handleMemberUpdate} fetchMembers={fetchMembers}/>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
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
};

export default AddMember;