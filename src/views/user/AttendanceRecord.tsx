
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { faChild, faChurch, faDatabase, faPeopleGroup, faTrash, faUser, faUserPlus, faUserSlash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../plugin/axios';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

function AttendanceHistory() {
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [attendanceAbsentCount, setAbsentAttendanceCount] = useState<number>(0);
  const [firstTimerCount, setfirstTimerCount] = useState<number>(0);
  const [lastSundayCount, setlastSundayCount] = useState<number>(0);

  const [attendanceToday, setAttendanceToday] = useState<any[]>([]);
  const [firstTimer, setfirstTimer] = useState<any[]>([]);
  const [attendanceAbsent, setAbsentAttendance] = useState<any[]>([]);
  const [lastSunday, setlastSunday] = useState<any[]>([]);

  const [searchQueryForTodaysAtt, setSearchQueryForTodaysAtt] = useState('');
  const [filteredAttendanceToday, setFilteredAttendanceToday] = useState<any[]>([]);

  const [searchQueryForFirstTimer, setSearchQueryForFirstTimer] = useState('');
  const [filteredFirstTimer, setFilteredFirstTimer] = useState<any[]>([]);

  const [searchQueryForAbsent, setSearchQueryForAbsent] = useState('');
  const [filteredAttendanceAbsent, setFilteredAttendanceAbsent] = useState<any[]>([]);

  const [searchQueryForLastSunday, setSearchQueryForLastSunday] = useState('');
  const [filteredLastSunday, setFilteredLastSunday] = useState<any[]>([]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('list-of-member', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setAttendanceCount(response.data.attendanceTodayCount);
      setAbsentAttendanceCount(response.data.absentTodayCount);
      setfirstTimerCount(response.data.firstTimerCount);
      setlastSundayCount(response.data.attendedLastSundayCount);

      setAttendanceToday(response.data.attendanceToday);
      setfirstTimer(response.data.firstTimer);
      setAbsentAttendance(response.data.absentToday);
      setlastSunday(response.data.attendedLastSunday);
    } catch (error) {
      console.error('Error fetching members:', error);
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
  }, [searchQueryForTodaysAtt, attendanceToday, searchQueryForFirstTimer, firstTimer, searchQueryForAbsent, attendanceAbsent, searchQueryForLastSunday, lastSunday]);

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
      sunday.member && sunday.member.name.toLowerCase().includes(searchQueryForLastSunday.toLowerCase())
    );
    setFilteredLastSunday(filtered);
  };

  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-3'>
          <div className='rounded-md min-h-80'>
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
                    <CardDescription className='font-bold text-green-500'>Total Attended Today</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-blue-500 animate-bounce'>
                        {attendanceAbsentCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faChild} className="ml-2 h-10 text-blue-100" />
                    </div>
                    <CardDescription className='font-bold text-blue-500'>Kids Attended Today</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div>
                <Card className='max-h-32 border border-b-4 border-primary shadow-md'>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className='text-3xl font-bold text-orange-500 animate-bounce'>
                        {attendanceAbsentCount}
                      </CardTitle>
                      <FontAwesomeIcon icon={faPeopleGroup} className="ml-2 h-10 text-orange-100" />
                    </div>
                    <CardDescription className='font-bold text-orange-500'>Adults Attended Today</CardDescription>
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
                    <CardDescription className='font-bold text-pink-500'>Total Attended Last Sunday</CardDescription>
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
                    <CardDescription className='font-bold text-yellow-500'>First Timer</CardDescription>
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
                    <CardDescription className='font-bold text-red-500'>Total Today's Absent</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              
            </div>

            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-1 gap-4'>
                <div>
                  <div className='py-2 flex flex-row justify-between'>
                    <label htmlFor="">List of Attended Today</label>
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
                          <TableHead className="text-center">Photo</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendanceToday.length > 0 ? (
                          filteredAttendanceToday.map((today) => (
                            <TableRow key={today.id}>
                              <TableCell className="flex justify-center items-center">
                                {today.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/storage/${today?.member.photo}`}
                                    alt={today.member.name}
                                    className="rounded-full h-10"
                                  />
                                ) : (
                                  <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                )}
                              </TableCell>
                              <TableCell>{today.member?.name}</TableCell>
                              <TableCell>{today.member?.role}</TableCell>
                              <TableCell>
                                {today.status === 0 ? (
                                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                    Present
                                  </span>
                                ) : (
                                  <span>{today.status}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button className='bg-red-500 hover:bg-red-300 ml-4 md:ml-2 h-7 w-5'>
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
                    <label htmlFor="">List of First Timer</label>
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
                          <TableHead className="text-center">Photo</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFirstTimer.length > 0 ? (
                          filteredFirstTimer.map((first) => (
                            <TableRow key={first.id}>
                              <TableCell className="flex justify-center items-center">
                                {first.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/storage/${first?.photo}`}
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
                              <TableCell>{first.name}</TableCell>
                              <TableCell>
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
                    <label htmlFor="">List of Today's Absent</label>
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
                          <TableHead className="text-center">Photo</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendanceAbsent.length > 0 ? (
                          filteredAttendanceAbsent.map((absent) => (
                            <TableRow key={absent.id}>
                              <TableCell className="flex justify-center items-center">
                                {absent.member?.photo ? (
                                  <img
                                    src={`${import.meta.env.VITE_URL}/storage/${absent?.member.photo}`}
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
                              <TableCell>{absent.member?.name}</TableCell>
                              <TableCell>{absent.member?.role}</TableCell>
                              <TableCell>
                                {absent.status === 1 ? (
                                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                                    Absent
                                  </span>
                                ) : (
                                  <span>{absent.status}</span>
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
                    <label htmlFor="">List of Total Attended Last Sunday</label>
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
                          <TableHead className="text-center">Photo</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLastSunday.length > 0 ? (
                          filteredLastSunday.map((sunday) => (
                            <TableRow key={sunday.id}>
                              <TableCell className="flex justify-center items-center">
                                {sunday.member?.photo ? (
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
                              <TableCell>{sunday.member?.name}</TableCell>
                              <TableCell>{sunday.member?.role}</TableCell>
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
