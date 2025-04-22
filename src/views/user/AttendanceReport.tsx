import { useRef } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableReport, TableRow } from '@/components/ui/table';
import axios from '../../plugin/axios';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Utility function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};

function AttendanceReport() {
  const [AttendanceReport, setAttendanceReport] = useState<any[]>([]);
  const [listofMembers, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const componentRef = useRef<HTMLDivElement>(null);

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
    const matchesMember = selectedMember === 'All' || sunday.member.id === selectedMember;
    const matchesRole = selectedRole === 'All' || sunday.member.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || (selectedStatus === 'light' ? sunday.status === 1 : sunday.status === 0);
    const matchesDate = selectedDate ? formatDate(sunday.updated_at) === formatDate(selectedDate) : true;
    return matchesMember && matchesRole && matchesStatus && matchesDate;
  });

  const totalPresent = filteredAttendance.filter((sunday) => sunday.status === 0).length;
  const totalAbsent = filteredAttendance.filter((sunday) => sunday.status === 1).length;

  // Calculate total kids present
  const totalKidsPresent = filteredAttendance.filter(
    (sunday) => sunday.member.role === "Kids Ministry" && sunday.status === 0
  ).length;

  // Calculate total adults present (excluding Kids Ministry)
  const totalAdultsPresent = filteredAttendance.filter(
    (sunday) => sunday.member.role !== "Kids Ministry" && sunday.status === 0
  ).length;

  const handlePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.height;
    let yOffset = 10; // Initial Y offset

    const addTableHeader = () => {
      pdf.setFontSize(10);
      pdf.setFillColor(191, 219, 254); // Set background color (bg-primary)
      pdf.rect(10, yOffset - 5, 190, 10, 'F'); // Draw filled rectangle for header background
      pdf.setTextColor(0, 0, 0); // Set text color to black
      pdf.text("Overall Attendance Report", 10, yOffset);
      yOffset += 10;
      pdf.text("No.", 10, yOffset);
      pdf.text("Full Name", 20, yOffset);
      pdf.text("Role/Ministry", 60, yOffset);
      pdf.text("Status", 110, yOffset);
      pdf.text("Date", 140, yOffset);
      yOffset += 10;
    };

    const addTableRow = (index: number, name: string, role: string, status: string, date: string) => {
      pdf.text(String(index), 10, yOffset);
      pdf.text(name, 20, yOffset);
      pdf.text(role, 60, yOffset);
      pdf.text(status, 110, yOffset);
      pdf.text(date, 140, yOffset);
      yOffset += 10;
    };

    const addSummary = () => {
      yOffset += 10;
      pdf.setFontSize(12);
      pdf.text(`Overall Total Present: ${totalPresent}`, 10, yOffset);
      yOffset += 10;
      pdf.text(`Overall Total Absent: ${totalAbsent}`, 10, yOffset);
      yOffset += 10;
      if (selectedRole === 'All') {
        pdf.text(`Kids Total Present: ${totalKidsPresent}`, 10, yOffset);
        yOffset += 10;
        pdf.text(`Adult Total Present: ${totalAdultsPresent}`, 10, yOffset);
      }
    };

    addTableHeader();

    filteredAttendance.forEach((sunday, index) => {
      const status = sunday.status === 0 ? 'Present' : 'Absent';
      const date = formatDate(sunday.updated_at);

      if (yOffset + 10 > pageHeight) {
        pdf.addPage();
        yOffset = 10;
        addTableHeader();
      }

      addTableRow(index + 1, sunday.member.name, sunday.member.role, status, date);
    });

    addSummary();

    pdf.save('attendance-report.pdf');
  };

  const handleExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAttendance.map((sunday, index) => ({
      '#': index + 1,
      'Full Name': sunday.member.name,
      'Role/Ministry': sunday.member.role,
      'Status': sunday.status === 0 ? 'Present' : 'Absent',
      'Date': formatDate(sunday.updated_at),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance-report.xlsx');
  };

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80' ref={componentRef}>
            <CardHeader>
                <div className='flex justify-between'>
                  <CardTitle className='text-lg md:text-base'>Overall Attendance Report</CardTitle>

                  <div className='flex flex-row space-x-2'>
                    <Button className='hover:bg-white bg-green-500 hover:text-black' onClick={handleExcel}>
                      <FontAwesomeIcon icon={faSheetPlastic} />
                      Excel
                    </Button>
                    <Button className='hover:bg-white bg-red-500 hover:text-black' onClick={handlePDF}>
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
                      defaultValue="All"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
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
                      defaultValue="All"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role or ministry" />
                        </SelectTrigger>
                        <SelectContent className='max-h-60 overflow-auto'>
                            <SelectItem value="All">All</SelectItem>
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
                      defaultValue="All"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
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
                <TableReport className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center md:text-xs'>#</TableHead>
                      <TableHead className='text-center md:text-xs'>Photo</TableHead>
                      <TableHead className='md:text-xs'>Full Name</TableHead>
                      <TableHead className='md:text-xs'>Role/Ministry</TableHead>
                      <TableHead className='md:text-xs'>Status</TableHead>
                      <TableHead className='md:text-xs'>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((sunday, index) => (
                        <TableRow key={sunday.id}>
                          <TableCell className='text-center'>{index + 1}</TableCell>
                          <TableCell className="flex justify-center items-center">
                            {sunday.member.photo ? (
                              <img
                                src={`${import.meta.env.VITE_URL}/storage/${sunday?.member.photo}`}
                                alt={sunday.member.name}
                                className="rounded-full h-10 w-10"
                              />
                            ) : (
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
                          </TableCell>
                          <TableCell className='md:text-xs'>{sunday.member.name}</TableCell>
                          <TableCell className='md:text-xs'>{sunday.member.role}</TableCell>
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
                          <TableCell className='md:text-xs'>{formatDate(sunday.updated_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No record found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </TableReport>
              </div>
              <div className='flex flex-row justify-end mt-5'>
                <div>
                  <p className='text-[#172554] text-base w-full font-bold'>Showing 1 to {filteredAttendance.length} entries</p>
                </div>
              </div>
              <div className='grid grid-cols-4 md:grid-cols-2 gap-4 mt-5'>
                <div className='text-lg md:text-base font-bold text-green-500'>Overall Total Present: {totalPresent}</div>
                <div className='text-lg font-bold md:text-base text-red-500'>Overall Total Absent: {totalAbsent}</div>
                {selectedRole === 'All' && (
                  <>
                    <div className='text-lg font-bold md:text-base text-blue-500'>Kids Total Present: {totalKidsPresent}</div>
                    <div className='text-lg font-bold md:text-base text-orange-500'>Adult Total Present: {totalAdultsPresent}</div>
                  </>
                )}
              </div>
             
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;