import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CardContent, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




function TithesReport() {
  return (
    <div className='ml-56 mx-auto md:ml-0 md:w-full mt-3'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-3'>
                <div className='rounded-md min-h-80'> 
                <CardContent>
              <div className='py-2 flex flex-row justify-between'>
                <CardTitle className='text-lg md:text-base'>Tithes Report</CardTitle>
                <Input
                  type='text'
                  placeholder='Search'
                  className='w-52'
                />
              </div>
              <div className='overflow-x-auto'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center md:text-xs'>Photo</TableHead>
                      <TableHead className='md:text-xs'>Full Name</TableHead>
                      <TableHead className='md:text-xs'>Amount</TableHead>
                      <TableHead className='md:text-xs'>Type</TableHead>
                      <TableHead className='md:text-xs'>Date given</TableHead>
                      <TableHead className='md:text-xs'>Payment Method</TableHead>
                      <TableHead className='md:text-xs'>Notes</TableHead>
                      <TableHead className="text-right md:text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    
                        <TableRow>
                          <TableCell className="flex justify-center md:justify-center item-center md:h-24 ">
                              <img
                                src=""className="rounded-full h-10 md:mt-5 w-10"
                              />
                              <Avatar className='h-10 md:mt-5 w-10'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                          </TableCell>
                          <TableCell className='md:text-xs'>1</TableCell>
                          <TableCell className='md:text-xs'>2</TableCell>
                          <TableCell className='md:text-xs'>2</TableCell>
                          <TableCell className='md:text-xs'>2</TableCell>
                          <TableCell className='md:text-xs'>2</TableCell>
                          <TableCell className='md:text-xs'>2</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end md:flex-col md:gap-3 items-center gap-1">
                              <Button
                                className="text-white h-7 bg-green-500 hover:bg-green-400 rounded-md" >
                              </Button>
                              <Button
                                className='text-white h-7 bg-red-500 hover:bg-red-400 rounded-md'>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      
                      {/* <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No record found
                        </TableCell>
                      </TableRow> */}
                  </TableBody>
                </Table>
              </div>
              <div className='flex flex-row justify-end mt-5'>
                <div>
                  <p className='text-[#172554] text-base w-full font-bold'>Showing 1 to 10 entries</p>
                </div>
              </div>
            </CardContent>
                </div>
            </div>
        </div>
        <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </DialogTrigger>
        <DialogContent className='overflow-auto max-h-[80vh] md:max-h-[90vh] md:max-w-[400px]'>
          <div>
            <DialogHeader className='text-start'>
              <DialogTitle>Add tithes & offering</DialogTitle>
              <DialogDescription>
                Add a new tithes & offering to the list.
              </DialogDescription>
            </DialogHeader>

           
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TithesReport
