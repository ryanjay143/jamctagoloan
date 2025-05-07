import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faChild, faChurch, faDatabase, faPeopleGroup, faUserPlus, faUserSlash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../plugin/axios';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';


function AttendanceHistory() {
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [attendanceAbsentCount, setAbsentAttendanceCount] = useState<number>(0);
  const [firstTimerCount, setfirstTimerCount] = useState<number>(0);
  const [lastSundayCount, setlastSundayCount] = useState<number>(0);
  const [kidsCount, setkidsCount] = useState<number>(0);
  const [adultCount, setadultCount] = useState<number>(0);

  const [attendanceToday, setAttendanceToday] = useState<any[]>([]);
  const [firstTimer, setfirstTimer] = useState<any[]>([]);
  const [attendanceAbsent, setAbsentAttendance] = useState<any[]>([]);
  const [lastSunday, setlastSunday] = useState<any[]>([]);
  const [kidsAttendance, setkidsAttendance] = useState<any[]>([]);

  const [searchQueryForTodaysAtt, setSearchQueryForTodaysAtt] = useState('');
  const [filteredAttendanceToday, setFilteredAttendanceToday] = useState<any[]>([]);

  const [searchQueryForFirstTimer, setSearchQueryForFirstTimer] = useState('');
  const [filteredFirstTimer, setFilteredFirstTimer] = useState<any[]>([]);

  const [searchQueryForAbsent, setSearchQueryForAbsent] = useState('');
  const [filteredAttendanceAbsent, setFilteredAttendanceAbsent] = useState<any[]>([]);

  const [searchQueryForLastSunday, setSearchQueryForLastSunday] = useState('');
  const [filteredLastSunday, setFilteredLastSunday] = useState<any[]>([]);

  const [searchQueryForKids, setSearchQueryForKids] = useState('');
  const [filteredKidsAttendance, setFilteredKidsAttendance] = useState<any[]>([]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('list-of-member', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setAttendanceCount(response.data.attendanceTodayCount || 0);
      setAbsentAttendanceCount(response.data.absentTodayCount || 0);
      setfirstTimerCount(response.data.firstTimerCount || 0);
      setlastSundayCount(response.data.attendedLastSundayCount || 0);
      setkidsCount(response.data.kidsAttendedTodayCount || 0);
      setadultCount(response.data.adultAttendedTodayCount || 0);

      setAttendanceToday(response.data.attendanceToday || []);
      setfirstTimer(response.data.firstTimer || []);
      setAbsentAttendance(response.data.absentToday || []);
      setlastSunday(response.data.attendedLastSunday || []);
      setkidsAttendance(response.data.kidsAttendedToday || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const deleteAttendance = async (id: string, name: string, type: string) => {
    try {
      await axios.delete(`list-of-member/${id}`);
      // Update the state to remove the deleted record
      if (type === 'today') {
        setAttendanceToday((prev) => prev.filter((item) => item.id !== id));
        setFilteredAttendanceToday((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'absent') {
        setAbsentAttendance((prev) => prev.filter((item) => item.id !== id));
        setFilteredAttendanceAbsent((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'kids') {
        setkidsAttendance((prev) => prev.filter((item) => item.id !== id));
        setFilteredKidsAttendance((prev) => prev.filter((item) => item.id !== id));
      }
      toast.success(`Attendance for ${name} deleted successfully!`);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Failed to delete attendance. Please try again.');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterAttendanceToday();
    filterFirstTimer();
    filterAttendanceAbsent();
    filterLastSunday();
    filterKidsAttendance();
  }, [searchQueryForTodaysAtt, attendanceToday, searchQueryForFirstTimer, firstTimer, searchQueryForAbsent, attendanceAbsent, searchQueryForLastSunday, lastSunday, searchQueryForKids, kidsAttendance]);

  const filterAttendanceToday = () => {
    const filtered = attendanceToday.filter((today) =>
      today.member && (
        today.member.name.toLowerCase().includes(searchQueryForTodaysAtt.toLowerCase()) ||
        today.member.role.toLowerCase().includes(searchQueryForTodaysAtt.toLowerCase())
      )
    );
    setFilteredAttendanceToday(filtered);
  };

  const filterFirstTimer = () => {
    const filtered = firstTimer.filter((first) =>
      first.name && first.name.toLowerCase().includes(searchQueryForFirstTimer.toLowerCase())
    );
    setFilteredFirstTimer(filtered);
  };

  const filterAttendanceAbsent = () => {
    const filtered = attendanceAbsent.filter((absent) =>
      absent.member && (
        absent.member.name.toLowerCase().includes(searchQueryForAbsent.toLowerCase()) ||
        absent.member.role.toLowerCase().includes(searchQueryForAbsent.toLowerCase())
      )
    );
    setFilteredAttendanceAbsent(filtered);
  };

  const filterLastSunday = () => {
    const filtered = lastSunday.filter((sunday) =>
      sunday.member && (
        sunday.member.name.toLowerCase().includes(searchQueryForLastSunday.toLowerCase()) ||
        sunday.member.role.toLowerCase().includes(searchQueryForLastSunday.toLowerCase())
      )
    );
    setFilteredLastSunday(filtered);
  };

  const filterKidsAttendance = () => {
    const filtered = kidsAttendance.filter((kids) =>
      kids.member && (
        kids.member.name.toLowerCase().includes(searchQueryForKids.toLowerCase()) ||
        kids.member.role.toLowerCase().includes(searchQueryForKids.toLowerCase())
      )
    );
    setFilteredKidsAttendance(filtered);
  };

  return (
    
    <div className='ml-56 mx-auto md:ml-0 md:w-full'>
      <ToastContainer />
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80 p-2 pl-2 md:pl-0'>
            <div className='grid grid-cols-3 md:grid-cols-2 gap-4 p-5'>
              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-green-500 animate-bounce'>
                        {attendanceCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faChurch} className="ml-2 h-10 text-green-100" />
                    </div>
                    <CardDescription className='font-bold text-green-500 md:text-xs'>Total Present Today</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-blue-500 animate-bounce'>
                        {kidsCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faChild} className="ml-2 h-10 text-blue-100" />
                    </div>
                    <CardDescription className='font-bold text-blue-500 md:text-xs'>Kids Attended Today</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-orange-500 animate-bounce'>
                        {adultCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faPeopleGroup} className="ml-2 h-10 text-orange-100" />
                    </div>
                    <CardDescription className='font-bold text-orange-500 md:text-xs'>Adults Attended Today</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-pink-500 animate-bounce'>
                        {lastSundayCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faDatabase} className="ml-2 h-10 text-pink-100" />
                    </div>
                    <CardDescription className='font-bold text-pink-500 md:text-xs'>Attended Last Sunday</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-yellow-500 animate-bounce'>
                        {firstTimerCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faUserPlus} className="ml-2 h-10 text-yellow-100" />
                    </div>
                    <CardDescription className='font-bold text-yellow-500 md:text-xs'>First Timer</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-red-500 animate-bounce'>
                        {attendanceAbsentCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faUserSlash} className="ml-2 h-10 text-red-100" />
                    </div>
                    <CardDescription className='font-bold text-red-500 md:text-xs'>Total Today's Absent</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              
            </div>

            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-1 gap-10'>
                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="" className='md:text-base'>Present today</label>
                    <Input
                      type='text'
                      placeholder='Search'
                      className='w-52'
                      value={searchQueryForTodaysAtt}
                      onChange={(e) => setSearchQueryForTodaysAtt(e.target.value)}
                    />
                  </div>
                  <div className='overflow-x-auto'>
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center md:text-xs">Photo</TableHead>
                          <TableHead className='md:text-xs'>Full Name</TableHead>
                          <TableHead className='md:text-xs'>Role</TableHead>
                          <TableHead className='md:text-xs'>Status</TableHead>
                          <TableHead className='md:text-xs'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendanceToday.length > 0 ? (
                          filteredAttendanceToday.map((today) => (
                            <TableRow key={today.id}>
                              <TableCell className="flex justify-center items-center md:text-xs">
                                {today.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/${today?.member.photo}`}
                                    alt={today.member.name}
                                    className="rounded-full h-10"
                                  />
                                ) : (
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>{today.member?.name}</AvatarFallback>
                                  </Avatar>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>{today.member?.name}</TableCell>
                              <TableCell className='md:text-xs'>{today.member?.role}</TableCell>
                              <TableCell className='md:text-xs'>
                                {today.status === 0 ? (
                                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                    Present
                                  </span>
                                ) : (
                                  <span>{today.status}</span>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>
                                <Button className='bg-red-500 hover:bg-red-300 ml-4 md:ml-2 h-7 w-5' onClick={() => deleteAttendance(today.id, today.member?.name, 'today')}>
                                    <FontAwesomeIcon icon={faX} />
                                </Button>
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
                </div>

                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="">First Timer</label>
                    <Input
                      type='text'
                      placeholder='Search'
                      className='w-52'
                      value={searchQueryForFirstTimer}
                      onChange={(e) => setSearchQueryForFirstTimer(e.target.value)}
                    />
                  </div>
                  <div className='overflow-x-auto'>
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center md:text-xs">Photo</TableHead>
                          <TableHead className='md:text-xs'>Full Name</TableHead>
                          <TableHead className='md:text-xs'>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFirstTimer.length > 0 ? (
                          filteredFirstTimer.map((first) => (
                            <TableRow key={first.id}>
                              <TableCell className="flex justify-center items-center md:text-xs">
                                {first.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/${first?.photo}`}
                                    alt={first.name}
                                    className="rounded-full h-10"
                                  />
                                ) : (
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>{first.name}</TableCell>
                              <TableCell className='md:text-xs'>
                                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                                  {first.role}
                                </span>
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
                </div>

                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="">Absent today</label>
                    <Input
                      type='text'
                      placeholder='Search'
                      className='w-52'
                      value={searchQueryForAbsent}
                      onChange={(e) => setSearchQueryForAbsent(e.target.value)}
                    />
                  </div>
                  <div className='overflow-x-auto'>
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center md:text-xs">Photo</TableHead>
                          <TableHead className='md:text-xs'>Full Name</TableHead>
                          <TableHead className='md:text-xs'>Role</TableHead>
                          <TableHead className='md:text-xs'>Status</TableHead>
                          <TableHead className='md:text-xs'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendanceAbsent.length > 0 ? (
                          filteredAttendanceAbsent.map((absent) => (
                            <TableRow key={absent.id}>
                              <TableCell className="flex justify-center items-center md:text-xs">
                                {absent.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/${absent?.member.photo}`}
                                    alt={absent.member.name}
                                    className="rounded-full h-10"
                                  />
                                ) : (
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>{absent.member?.name}</TableCell>
                              <TableCell className='md:text-xs'>{absent.member?.role}</TableCell>
                              <TableCell>
                                {absent.status === 1 ? (
                                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                                    Absent
                                  </span>
                                ) : (
                                  <span>{absent.status}</span>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>
                                <Button className='bg-red-500 hover:bg-red-300 ml-4 md:ml-2 h-7 w-5' onClick={() => deleteAttendance(absent.id, absent.member?.name, 'today')}>
                                    <FontAwesomeIcon icon={faX} />
                                </Button>
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
                </div>

                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="" className='md:text-sm'>Attended Last Sunday</label>
                    <Input
                      type='text'
                      placeholder='Search'
                      className='w-52'
                      value={searchQueryForLastSunday}
                      onChange={(e) => setSearchQueryForLastSunday(e.target.value)}
                    />
                  </div>
                  <div className='overflow-x-auto'>
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center md:text-xs">#</TableHead>
                          <TableHead className="text-center md:text-xs">Photo</TableHead>
                          <TableHead className='md:text-xs'>Full Name</TableHead>
                          <TableHead className='md:text-xs'>Role</TableHead>
                          <TableHead className='md:text-xs'>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLastSunday.length > 0 ? (
                          filteredLastSunday.map((sunday, index) => (
                            <TableRow key={sunday.id}>
                              <TableCell className='md:text-xs'>{index + 1}</TableCell>
                              <TableCell className="flex justify-center items-center md:text-xs">
                                {sunday.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/${sunday?.member.photo}`}
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
                              <TableCell className='md:text-xs'>{sunday.member?.name}</TableCell>
                              <TableCell className='md:text-xs'>{sunday.member?.role}</TableCell>
                              <TableCell className='md:text-xs'>
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
                </div>

                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="">Kids Attended Today</label>
                    <Input
                      type='text'
                      placeholder='Search'
                      className='w-52'
                      value={searchQueryForKids}
                      onChange={(e) => setSearchQueryForKids(e.target.value)}
                    />
                  </div>
                  <div className='overflow-x-auto'>
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center md:text-xs">Photo</TableHead>
                          <TableHead className='md:text-xs'>Full Name</TableHead>
                          <TableHead className='md:text-xs'>Role/Ministry</TableHead>
                          <TableHead className='md:text-xs'>Status</TableHead>
                          <TableHead className='md:text-xs'>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredKidsAttendance.length > 0 ? (
                          filteredKidsAttendance.map((kids) => (
                            <TableRow key={kids.id}>
                              <TableCell className="flex justify-center items-center md:text-xs">
                                {kids.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/${kids.member?.photo}`}
                                    alt={kids.member?.name}
                                    className="rounded-full h-10"
                                  />
                                ) : (
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>{kids.member?.name}</TableCell>
                              <TableCell className='md:text-xs'>
                                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                                  {kids.member?.role}
                                </span>
                              </TableCell>
                              <TableCell className='md:text-xs'>
                                {kids.status === 1 ? (
                                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                                    Absent
                                  </span>
                                ) : kids.status === 0 ? (
                                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                    Present
                                  </span>
                                ) : (
                                  <span>{kids.status}</span>
                                )}
                              </TableCell>
                              <TableCell className='md:text-xs'>
                                <Button className='bg-red-500 hover:bg-red-300 ml-4 md:ml-2 h-7 w-5' onClick={() => deleteAttendance(kids.id, kids.member?.name, 'today')}>
                                    <FontAwesomeIcon icon={faX} />
                                </Button>
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
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceHistory;
