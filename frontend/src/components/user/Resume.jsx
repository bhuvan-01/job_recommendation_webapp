import { FileText, Pencil, Upload, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import apiClient from '@/services/apiClient';
import useUser from '@/hooks/useUser';

const BASE_URL = import.meta.env.VITE_API || 'http://localhost:5000';

const Resume = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validationSchema = Yup.object({
    resume: Yup.mixed().required('Resume is required'),
  });

  const formik = useFormik({
    initialValues: {
      resume: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', values.resume);

      try {
        const res = await apiClient.post('/users/resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        updateUser(res.data.user);

        formik.resetForm();
        setIsEditing(false);
      } catch (error) {
        console.error('Error uploading resume:', error);
      } finally {
        setUploading(false);
      }
    },
    enableReinitialize: true,
  });

  const handleFileChange = (event) => {
    formik.setFieldValue('resume', event.currentTarget.files[0]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const resumeUrl = user?.profile?.resume
    ? `${BASE_URL}/${user.profile.resume}`
    : null;

  return (
    <section className='mt-4 md:m-0 border p-4 md:p-8 rounded-md'>
      <div className='flex mb-2 justify-between items-center'>
        <h1 className='text-2xl flex items-center gap-2'>
          <FileText size={20} className='text-gray-600' />
          Resume
        </h1>
        {isEditing ? null : (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>
        )}
      </div>
      {isEditing ? (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsEditing(true)}
              className='flex justify-center gap-2 items-center'
            >
              Edit <Pencil size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Upload Resume</DialogTitle>
              <DialogDescription>
                Upload your resume file here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='resume' className='text-right'>
                    Resume
                  </Label>
                  <Input
                    id='resume'
                    name='resume'
                    type='file'
                    onChange={handleFileChange}
                    className='col-span-3'
                  />
                  {formik.touched.resume && formik.errors.resume ? (
                    <div className='text-red-500 col-span-4'>
                      {formik.errors.resume}
                    </div>
                  ) : null}
                </div>
              </div>
              <DialogFooter className=''>
                <Button type='submit' disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save'}
                  <Check size={16} />
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='md:ml-2 mb-2 md:mb-0'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel <X size={16} />
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600'
            >
              View Resume
            </a>
          ) : (
            <p>No resume found</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Resume;
