import React, { useState, useEffect } from 'react';
import axios from '../../../plugin/axios';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Swal from 'sweetalert2';
import DialogAddMember from './children/DialogAddMember';
import TableAddMember from './children/TableAddMember';

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

  const handleRoleChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: '',
    }));
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
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Member added successfully!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        fetchMembers();
        setIsDialogOpen(false);
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

  return (
    <div className="ml-56 mx-auto md:ml-0 md:w-full mt-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <div className="rounded-md min-h-80">
            <CardContent>
              <div className="py-2 flex flex-row justify-between">
                <label htmlFor="" className="text-3xl">List of members</label>
                <Input
                  type="text"
                  placeholder="Search"
                  className="w-52"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <TableAddMember
                  getMember={fetchMembers}
                  members={filteredMembers}
                  handleEditFileChange={handleEditFileChange}
                  editPhotoPreview={editPhotoPreview}
                />
              </div>
              <div className="flex flex-row justify-between mt-3">
                <div>
                  <p className="text-[#172554] text-sm w-full">Showing 1 to 10 of {filteredMembers.length} entries</p>
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
      <DialogAddMember
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
        handleAddFileChange={handleAddFileChange}
        handleSubmit={handleSubmit}
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
        formData={formData}
        errors={errors}
        photoPreview={photoPreview}
        loading={loading}
      />
    </div>
  );
};

export default AddMember;