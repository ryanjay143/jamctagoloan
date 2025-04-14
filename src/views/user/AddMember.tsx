import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../plugin/axios';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditMemberInfo from './EditMemberInfo';

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
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
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

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setEditPhotoPreview(null);
      } else {
        // Create a FileReader to read the file and set the preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditPhotoPreview(reader.result as string);
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
          <div className='rounded-md min-h-80'>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
              <label htmlFor="" className='text-3xl'>List of members</label>
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="flex justify-center items-center">
                            {member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/storage/${member.photo}`}
                                alt={member.name}
                                className="rounded-full h-10 w-10"
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
          <div >
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
                  <SelectTrigger >
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
                    <span>Adding Mmeber...</span>
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
};

export default AddMember;