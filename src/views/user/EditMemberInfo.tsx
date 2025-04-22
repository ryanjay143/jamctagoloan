import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import axios from '../../plugin/axios';
import Swal from 'sweetalert2';

const EditMemberInfo: React.FC<{ member: any; onUpdate: (updatedMember: any) => void; fetchMembers: () => void }> = ({ member, onUpdate, fetchMembers }) => {
  const [editData, setEditData] = useState(member);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(member.photo ? `${import.meta.env.VITE_URL}/storage/${member.photo}` : null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setEditPhotoPreview(null);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setEditData({ ...editData, photo: file });
      }
    }
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    const data = new FormData();
    data.append('name', editData.name);
    data.append('role', editData.role);
    data.append('church_status', editData.church_status);
    data.append('attendance_status', editData.attendance_status);
    if (editData.photo instanceof File) {
      data.append('photo', editData.photo);
    }

    try {
      const response = await axios.post(`edit-member/${editData.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data.listOfMember);
      setIsDialogOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        fetchMembers();
      });
    } catch (error) {
      console.error('Error updating member:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the member. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="text-white w-7 h-7 bg-green-500 hover:bg-green-400 rounded-md">
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </DialogTrigger>
        <DialogContent className='overflow-auto md:max-h-[90vh]  max-h-[100%] md:max-w-[400px]'>
          <DialogHeader className='text-start'>
            <DialogTitle>Edit Member Info</DialogTitle>
            <DialogDescription>
              Edit member to the list.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter fullname"
              value={editData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="role">Role/Ministry</Label>
            <Select name="role" value={editData.role} onValueChange={(value) => setEditData({ ...editData, role: value })}>
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
                <SelectItem value="Cleaning Ministry">Cleaning Ministry</SelectItem>
                <SelectItem value="Family life">Family life</SelectItem>
                <SelectItem value="Arrow life">Arrow life</SelectItem>
                <SelectItem value="Visitor">Visitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="churchStatus">Church Status</Label>
            <Select name="church_status" value={editData.church_status} onValueChange={(value) => setEditData({ ...editData, church_status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Active</SelectItem>
                <SelectItem value="1">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid items-center gap-1.5">
            <Label htmlFor="picture">Photo</Label>
            <Input
              id="edit-picture"
              type="file"
              onChange={handleEditFileChange}
              accept="image/*"
            />
            {editPhotoPreview && <img src={editPhotoPreview} alt="Preview" className="w-full rounded-md" />}
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <span>Saving...</span>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faArrowRight} />
                Save Changes
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditMemberInfo;