
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from '../../plugin/axios';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPager, faPrint } from '@fortawesome/free-solid-svg-icons';

// Utility function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

function AttendanceReport() {
  const [AttendanceReport, setAttendanceReport] = useState<any[]>([]);
  const [listofMembers, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('list-of-member', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Overall attendance: ", response.data.overAllAttendance);
      setAttendanceReport(response.data.overAllAttendance);
      setMembers(response.data.listOfMembers);

    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredAttendance = AttendanceReport.filter((sunday) => {
    const matchesMember = selectedMember ? sunday.member.id === selectedMember : true;
    const matchesRole = selectedRole ? sunday.member.role === selectedRole : true;
    const matchesStatus = selectedStatus ? (selectedStatus === 'light' ? sunday.status === 1 : sunday.status === 0) : true;
    const matchesDate = selectedDate ? formatDate(sunday.updated_at) === formatDate(selectedDate) : true;
    return matchesMember && matchesRole && matchesStatus && matchesDate;
  });

  const totalPresent = filteredAttendance.filter((sunday) => sunday.status === 0).length;
  const totalAbsent = filteredAttendance.filter((sunday) => sunday.status === 1).length;

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80'>
            <CardHeader>
                <div className='flex justify-between'>
                    <div>
                        <CardTitle className='text-3xl md:text-xl'>Overall Attendance Report</CardTitle>
                    </div>

                    <div className='flec flex-row space-x-2'>
                        <Button className='hover:bg-white hover:text-black'>
                           <FontAwesomeIcon icon={faPrint} />
                            Print
                        </Button>

                        <Button className='hover:bg-white bg-red-500 hover:text-black'>
                           <FontAwesomeIcon icon={faFilePdf} />
                            PDF
                        </Button>
                    </div>
                    
                </div>

               
              
            </CardHeader>
            <CardContent>
              <div className='py-2 grid grid-cols-4 md:grid-cols-2 gap-4'>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="">Member:</Label>
                    <Select
                      onValueChange={(value) => setSelectedMember(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent>
                      {listofMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="">Ministry/Role:</Label>
                    <Select
                      onValueChange={(value) => setSelectedRole(value)}
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
                            <SelectItem value="Cleaning Ministry">Cleaning Ministry</SelectItem>
                            <SelectItem value="Family life">Family life</SelectItem>
                            <SelectItem value="Arrow life">Arrow life</SelectItem>
                            <SelectItem value="Visitor">Visitor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="">Status</Label>
                    <Select
                      onValueChange={(value) => setSelectedStatus(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Absent</SelectItem>
                            <SelectItem value="dark">Present</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="">Date Selection:</Label>
                    <Input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
                </div>

              </div>
              <div className='overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>Photo</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Role/Ministry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((sunday) => (
                        <TableRow key={sunday.id}>
                          <TableCell className="flex justify-center items-center">
                            {sunday.member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/storage/${sunday?.member.photo}`}
                                alt={sunday.member.name}
                                className="rounded-full h-10"
                              />
                            ) : (
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell>{sunday.member.name}</TableCell>
                          <TableCell>{sunday.member.role}</TableCell>
                          <TableCell>
                            {sunday.status === 1 ? (
                              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                                Absent
                              </span>
                            ) : sunday.status === 0 ? (
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                Present
                              </span>
                            ) : (
                              <span>{sunday.status}</span>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(sunday.updated_at)}</TableCell>
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
              <div className='flex flex-row justify-between mt-3'>
                <div>
                  <p className='text-[#172554] text-sm w-full'>Showing 1 to {filteredAttendance.length} of {AttendanceReport.length} entries</p>
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
             <div className='grid grid-cols-2'>
                <div>
                    <div className='text-2xl md:text-base md:mt-10 font-bold text-green-500'>Overall Total Present: {totalPresent}</div>
                </div>

                <div>
                    <div className='text-2xl font-bold md:text-base md:mt-10 text-red-500'>Overall Total Absent: {totalAbsent}</div>
                </div>
             </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
