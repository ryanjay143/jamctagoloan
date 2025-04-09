import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function TrackAttendance() {
  return (
    <div className="pt-3 w-[75%] ml-60 h-screen mx-auto md:ml-0 md:mt-5 md:w-full">
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
                    <TableHead className="w-[100px]">Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Ryan Reyes</TableCell>
                    <TableCell>Ministry Head</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-white px-3 h-7 rounded-md">
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> 
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <div className='flex flex-row justify-between mt-3'>
            <div>
                <p className='text-[#172554] text-sm w-full'>Showing 1 to 10 of 57 entries</p>
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
    </div>
  )
}

export default TrackAttendance
