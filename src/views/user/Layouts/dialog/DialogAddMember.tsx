import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faAdd, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DialogAddMemberProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: { fullname: string; role: string; photo: File | null };
  setFormData: React.Dispatch<React.SetStateAction<{ fullname: string; role: string; photo: File | null }>>;
  errors: { fullname?: string; role?: string };
  setErrors: React.Dispatch<React.SetStateAction<{ fullname?: string; role?: string }>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  photoPreview: string | null;
  loading: boolean;
}

function DialogAddMember({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  errors,
  handleInputChange,
  handleAddFileChange,
  handleSubmit,
  photoPreview,
  loading,
}: DialogAddMemberProps) {
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </DialogTrigger>
        <DialogContent className='overflow-auto max-h-[80vh] md:max-h-[90vh] md:max-w-[400px]'>
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

export default DialogAddMember;