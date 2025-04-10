import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import img from '../../assets/image.jpg'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

function AdMember() {
  return (
    <div className='p-3 w-[75%] ml-60 mx-auto md:ml-0 md:w-full mt-3'>
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Card className='border border-b-4 border-primary rounded-md shadow-md'>
            <CardHeader>
              <CardTitle className='text-xs'>Church member form</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 '> 
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="fullname">Full Name</Label>
                <Input type="text" placeholder="Enter fullname" className='md:w-32'/>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="role">Role</Label>
                <Select >
                  <SelectTrigger className='md:w-32'>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Photo</Label>
                <Input id="picture" type="file" className='md:w-32'/>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Button className='md:w-32'>
                 <FontAwesomeIcon icon={faAdd} /> Add Member 
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-2'>
          <Card className='border border-b-4 border-primary rounded-md shadow-md'>
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
                  <TableHead>Photo</TableHead>
                  <TableHead className="w-[100px]">Full Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <img src={img} alt="" className='rounded-full h-10'/>
                  </TableCell>
                  <TableCell>Ryan Reyes</TableCell>
                  <TableCell>MST</TableCell>
                  <TableCell className="text-right">
                    <Button className=" text-white w-7 h-7 rounded-md">
                        <FontAwesomeIcon icon={faEye} /> 
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
            </CardContent>
          </Card>
        </div>
      

      </div>
    </div>
  )
}

export default AdMember
