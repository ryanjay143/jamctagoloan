import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faAdd, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from '../../plugin/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Swal from 'sweetalert2';

const AddMember: React.FC = () => {
  const initialFormState = {
    fullname: '',
    role: '',
    photo: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<{ fullname?: string; role?: string; photo?: string }>({});
  const [members, setMembers] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, photo: 'Invalid file type. Only jpeg, png, jpg, gif are allowed.' });
        setFormData({ ...formData, photo: null });
        setPhotoPreview(null);
      } else {
        setFormData({ ...formData, photo: file });
        setErrors({ ...errors, photo: '' });

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
    const newErrors: { fullname?: string; role?: string; photo?: string } = {};
    if (!formData.fullname) newErrors.fullname = 'Full name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
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

    try {
      const response = await axios.post('list-of-member', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Member added successfully!',
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
      alert('There was an error adding the member. Please try again.');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('list-of-member', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  return (
    <div className='p-3 w-[83%] ml-60 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Card className='border border-b-4 border-primary rounded-md shadow-md'>
            <CardHeader>
              <CardTitle className='md:text-xs text-lg'>Church member form</CardTitle>
            </CardHeader>
            <CardContent>
              <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
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

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="md:w-32">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First timer">First timer</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                      <SelectItem value="Multimedia Team">MST</SelectItem>
                      <SelectItem value="Usher">UST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="Finance Team">Finance Team</SelectItem>
                      <SelectItem value="PWT">PWT</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <span className="text-red-500">{errors.role}</span>}
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Photo</Label>
                  <Input
                    id="picture"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {errors.photo && <span className="text-red-500">{errors.photo}</span>}
                  {photoPreview && <img src={photoPreview} alt="Preview" className="w-full h-60 rounded-md" />}
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Button type="submit" className='md:w-32'>
                    <FontAwesomeIcon icon={faAdd} /> Add Member
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-2'>
          <Card className='border border-b-4 border-primary rounded-md shadow-md min-h-80'>
            <CardHeader>
              <CardTitle>List of members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <Select>
                  <SelectTrigger className="w-[120px] border border-primary">
                    <span className='text-[#172554]'>Show</span>
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Input type='text' placeholder='Search' className='w-52' />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>Photo</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Staus</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex justify-center items-center">
                        <img
                          src={member.photo ? `${import.meta.env.VITE_URL}/storage/${member.photo}` : '/path/to/default-image.jpg'}
                          alt={member.name}
                          className="rounded-full h-10"
                        />
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        {member.status === '0' ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset">Inactive</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                          {/* <Button className=" text-white w-7 h-7 rounded-md">
                            <FontAwesomeIcon icon={faEye} />
                          </Button> */}

                          <Button className=" text-white w-7 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPen} />
                          </Button>
                        </div>
                        
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='flex flex-row justify-between mt-3'>
                <div>
                  <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of {members.length} entries</p>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddMember;