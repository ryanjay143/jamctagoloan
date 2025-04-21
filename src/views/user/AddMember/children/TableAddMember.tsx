import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TableAddMemberProps {
  members: any[];
  getMember: () => void;
  handleEditFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editPhotoPreview: string | null;
}

const TableAddMember: React.FC<TableAddMemberProps> = ({ members, getMember, handleEditFileChange, editPhotoPreview }) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Photo</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Role/Ministry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length > 0 ? (
          members.map((member) => (
            <TableRow key={member.id}>
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
                  <Dialog>
                    <DialogTrigger>
                      <Button className="text-white w-7 h-7 rounded-md">
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="text-start">
                        <DialogTitle>Edit Member Info</DialogTitle>
                        <DialogDescription>Edit member to the list.</DialogDescription>
                      </DialogHeader>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                          type="text"
                          name="fullname"
                          placeholder="Enter fullname"
                          value={member.name}
                        />
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="role">Role/Ministry</Label>
                        <Select name="role" value={member.role}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role or ministry" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-auto">
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
                        <Label htmlFor="picture">Photo</Label>
                        <Input
                          id="edit-picture"
                          type="file"
                          onChange={handleEditFileChange}
                          accept="image/*"
                        />
                        {editPhotoPreview && <img src={editPhotoPreview} alt="Preview" className="w-full h-60 rounded-md" />}
                      </div>
                    </DialogContent>
                  </Dialog>
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
  );
};

export default TableAddMember;